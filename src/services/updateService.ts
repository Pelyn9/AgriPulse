import { GITHUB_REPO } from '../config/version';

interface GitHubRelease {
  tag_name: string;
  name: string;
  body: string;
  assets: {
    name: string;
    browser_download_url: string;
  }[];
}

export interface UpdateResult {
  available: boolean;
  version: string | null;
  apkUrl: string | null;
  releaseNotes: string | null;
}

function parseVersion(tag: string): number[] {
  return tag
    .replace(/^v/i, '')
    .split('.')
    .map((n) => parseInt(n, 10) || 0);
}

function isNewer(latest: string, current: string): boolean {
  const a = parseVersion(latest);
  const b = parseVersion(current);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i] ?? 0;
    const y = b[i] ?? 0;
    if (x > y) return true;
    if (x < y) return false;
  }
  return false;
}

export async function checkForUpdate(currentVersion: string): Promise<UpdateResult> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
      { headers: { Accept: 'application/vnd.github.v3+json' } },
    );
    if (!res.ok) return { available: false, version: null, apkUrl: null, releaseNotes: null };

    const release: GitHubRelease = await res.json();
    const tag = release.tag_name;
    const apkAsset = release.assets.find((a) => a.name.endsWith('.apk'));

    if (!apkAsset || !isNewer(tag, currentVersion)) {
      return { available: false, version: null, apkUrl: null, releaseNotes: null };
    }

    return {
      available: true,
      version: tag.replace(/^v/i, ''),
      apkUrl: apkAsset.browser_download_url,
      releaseNotes: release.body || null,
    };
  } catch {
    return { available: false, version: null, apkUrl: null, releaseNotes: null };
  }
}
