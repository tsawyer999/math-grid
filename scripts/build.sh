#!/bin/bash
set -e  # Exit on any error

# Get the script's directory and navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"  # This is the parent of scripts/
cd "$PROJECT_ROOT"                        # Navigate to project root

DIST_FOLDER="dist"
SOURCE_FOLDER="source"

# Create dist folder (removes existing one first)
rm -rf "$DIST_FOLDER"
mkdir "$DIST_FOLDER"

# Copy files and folders
ITEMS=("css" "js" "index.html" "favicon.ico" "locales" "templates")
for item in "${ITEMS[@]}"; do
    if [ -e "$SOURCE_FOLDER/$item" ]; then
        cp -r "$SOURCE_FOLDER/$item" "$DIST_FOLDER/"
    fi
done
