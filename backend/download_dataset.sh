#!/bin/bash
# Download rice leaf disease dataset from Kaggle
# Requires: curl, unzip, and Kaggle API credentials (kaggle.json)

set -e

DATASET_URL="https://www.kaggle.com/api/v1/datasets/download/uynguyenthai/rice-leaf-disease-final-dataset"
ZIP_FILE="rice-leaf-disease-final-dataset.zip"
DEST_DIR="data/rice_leaf_disease"

echo "Downloading rice leaf disease dataset from Kaggle..."
curl -L -o "$ZIP_FILE" "$DATASET_URL"

echo "Extracting dataset..."
unzip -o "$ZIP_FILE" -d "$DEST_DIR"

echo "Cleaning up zip file..."
rm -f "$ZIP_FILE"

echo "Done! Dataset saved to $DEST_DIR"
