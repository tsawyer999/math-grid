#!/bin/bash
set -e  # Exit on any error

DIST_FOLDER="dist"
SOURCE_FOLDER="source"

# Create dist folder (removes existing one first)
rm -rf "$DIST_FOLDER"
mkdir "$DIST_FOLDER"

# Copy files
FILES=("app.css" "app.js" "index.html" "favicon.ico")
for file in "${FILES[@]}"; do
    cp "$SOURCE_FOLDER/$file" "$DIST_FOLDER"
done
