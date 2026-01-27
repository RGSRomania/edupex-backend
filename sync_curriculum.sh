#!/bin/bash

# ==============================================================================
# CURRICULUM SYNCHRONIZATION SCRIPT
# ==============================================================================
# Purpose: Keep all curriculum_structure.json copies synchronized
#
# Background:
# There are 4 copies of curriculum_structure.json in the project:
# 1. /curriculum_structure.json (root - source file)
# 2. /frontend/public/curriculum_structure.json (served by React dev server)
# 3. /frontend/src/data/curriculum_structure.json (used by some components)
# 4. /backend/curriculum_structure.json (used by Node backend)
#
# When you update the curriculum, run this script to sync ALL copies!
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║          🔄 CURRICULUM SYNCHRONIZATION SCRIPT                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Source file
SOURCE_FILE="$SCRIPT_DIR/curriculum_structure.json"

# Target files
TARGET_FILES=(
  "$SCRIPT_DIR/frontend/public/curriculum_structure.json"
  "$SCRIPT_DIR/frontend/src/data/curriculum_structure.json"
  "$SCRIPT_DIR/backend/curriculum_structure.json"
)

# Check if source file exists
if [ ! -f "$SOURCE_FILE" ]; then
  echo "❌ ERROR: Source file not found: $SOURCE_FILE"
  exit 1
fi

echo "📁 Source: $SOURCE_FILE"
echo "  MD5: $(md5 -q "$SOURCE_FILE")"
echo ""

echo "Syncing to all locations..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

for target in "${TARGET_FILES[@]}"; do
  if [ -f "$target" ]; then
    cp "$SOURCE_FILE" "$target"
    echo "✅ Synced: $target"
  else
    echo "⚠️  Skipped (not found): $target"
  fi
done

echo ""
echo "Verifying all files are identical..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Get MD5 of source file
SOURCE_MD5=$(md5 -q "$SOURCE_FILE")

# Check all files
ALL_MATCH=true
for target in "${TARGET_FILES[@]}"; do
  if [ -f "$target" ]; then
    TARGET_MD5=$(md5 -q "$target")
    if [ "$SOURCE_MD5" = "$TARGET_MD5" ]; then
      echo "✅ $target"
    else
      echo "❌ $target (MD5 mismatch!)"
      ALL_MATCH=false
    fi
  fi
done

echo ""
if [ "$ALL_MATCH" = true ]; then
  echo "✅ All curriculum files are synchronized!"
  echo "   MD5: $SOURCE_MD5"
  echo ""
  echo "Next steps:"
  echo "  1. Clear browser cache (Cmd+Shift+Delete on Mac)"
  echo "  2. Hard refresh (Cmd+Shift+R)"
  echo "  3. Reload http://localhost:3000"
  echo ""
else
  echo "❌ Some files have mismatched checksums!"
  exit 1
fi

