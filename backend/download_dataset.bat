@echo off
REM Download rice leaf disease dataset from Kaggle
REM Requires: curl, unzip, and Kaggle API credentials (kaggle.json)

set DATASET_URL=https://www.kaggle.com/api/v1/datasets/download/uynguyenthai/rice-leaf-disease-final-dataset
set ZIP_FILE=rice-leaf-disease-final-dataset.zip
set DEST_DIR=data\rice_leaf_disease

echo Downloading rice leaf disease dataset from Kaggle...
curl -L -o %ZIP_FILE% %DATASET_URL%

echo Extracting dataset...
tar -xf %ZIP_FILE% -C %DEST_DIR% 2>nul || powershell -command "Expand-Archive -Path '%ZIP_FILE%' -DestinationPath '%DEST_DIR%' -Force"

echo Cleaning up zip file...
del %ZIP_FILE%

echo Done! Dataset saved to %DEST_DIR%
