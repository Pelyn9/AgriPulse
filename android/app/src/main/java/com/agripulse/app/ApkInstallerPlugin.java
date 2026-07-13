package com.agripulse.app;

import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.ActivityCallback;

import java.io.File;

@CapacitorPlugin(name = "ApkInstaller")
public class ApkInstallerPlugin extends Plugin {

    private static final String APK_DIR = "AgriPulseUpdates";
    private PluginCall savedCall;
    private long downloadId;

    @PluginMethod
    public void downloadAndInstall(PluginCall call) {
        String url = call.getString("url");
        String fileName = call.getString("fileName", "update.apk");

        if (url == null || url.isEmpty()) {
            call.reject("URL is required");
            return;
        }

        savedCall = call;

        File dir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), APK_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        File file = new File(dir, fileName);

        DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
        request.setTitle("AgriPulse Update");
        request.setDescription("Downloading update...");
        request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, APK_DIR + "/" + fileName);
        request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
        request.setAllowedOverMetered(true);
        request.setAllowedOverRoaming(true);

        DownloadManager manager = (DownloadManager) getContext().getSystemService(Context.DOWNLOAD_SERVICE);
        downloadId = manager.enqueue(request);

        IntentFilter filter = new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE);
        BroadcastReceiver receiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                long id = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
                if (id == downloadId) {
                    installApk(context, file, dir);
                }
            }
        };

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            getContext().registerReceiver(receiver, filter, Context.RECEIVER_NOT_EXPORTED);
        } else {
            getContext().registerReceiver(receiver, filter);
        }

        notifyListeners("downloadProgress", new JSObject().put("progress", 0).put("status", "downloading"));

        new Thread(() -> {
            boolean running = true;
            while (running) {
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    break;
                }

                DownloadManager.Query query = new DownloadManager.Query();
                query.setFilterById(downloadId);
                Cursor cursor = manager.query(query);
                if (cursor != null && cursor.moveToFirst()) {
                    int statusIdx = cursor.getColumnIndex(DownloadManager.COLUMN_STATUS);
                    int bytesIdx = cursor.getColumnIndex(DownloadManager.COLUMN_BYTES_DOWNLOADED_SO_FAR);
                    int totalIdx = cursor.getColumnIndex(DownloadManager.COLUMN_TOTAL_SIZE_BYTES);

                    int status = cursor.getInt(statusIdx);
                    long bytes = cursor.getLong(bytesIdx);
                    long total = cursor.getLong(totalIdx);

                    if (total > 0) {
                        int progress = (int) ((bytes * 100) / total);
                        JSObject data = new JSObject()
                            .put("progress", progress)
                            .put("status", "downloading");
                        notifyListeners("downloadProgress", data);
                    }

                    if (status == DownloadManager.STATUS_SUCCESSFUL) {
                        running = false;
                        notifyListeners("downloadProgress", new JSObject().put("progress", 100).put("status", "done"));
                    } else if (status == DownloadManager.STATUS_FAILED) {
                        running = false;
                        if (savedCall != null) {
                            savedCall.reject("Download failed");
                            savedCall = null;
                        }
                    }
                    cursor.close();
                }
            }
        }).start();
    }

    private void installApk(Context context, File file, File dir) {
        try {
            Uri uri;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                uri = FileProvider.getUriForFile(
                    context,
                    context.getPackageName() + ".fileprovider",
                    new File(dir, file.getName())
                );
            } else {
                uri = Uri.fromFile(file);
            }

            Intent install = new Intent(Intent.ACTION_VIEW);
            install.setDataAndType(uri, "application/vnd.android.package-archive");
            install.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            install.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(install);

            notifyListeners("downloadProgress", new JSObject().put("progress", 100).put("status", "installed"));

            if (savedCall != null) {
                JSObject result = new JSObject().put("success", true);
                savedCall.resolve(result);
                savedCall = null;
            }
        } catch (Exception e) {
            if (savedCall != null) {
                savedCall.reject("Failed to open installer: " + e.getMessage());
                savedCall = null;
            }
        }
    }
}
