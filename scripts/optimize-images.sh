#!/bin/bash

# Image Optimization Script for ChefFlow
# This script optimizes images in the public directory using sharp-cli
# Run with: bash scripts/optimize-images.sh

echo "Installing sharp-cli if not present..."
if ! command -v sharp &> /dev/null; then
  echo "sharp-cli not found. Installing globally..."
  npm install -g sharp-cli
fi

echo ""
echo "=== ChefFlow Image Optimization ==="
echo ""

# Create backup directory
BACKUP_DIR="public/images-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📦 Backing up original images to $BACKUP_DIR..."
cp public/chefflow.png "$BACKUP_DIR/"
cp public/chefflow_name.png "$BACKUP_DIR/"
cp public/chefflow_white_bg.jpg "$BACKUP_DIR/"

echo ""
echo "🖼️  Original sizes:"
ls -lh public/chefflow*.{png,jpg} | awk '{print $9, $5}'

echo ""
echo "⚙️  Optimizing images..."

# Convert chefflow.png to WebP and compress (logo - multiple sizes)
echo "  - chefflow.png (logo)..."
sharp -i public/chefflow.png -o public/chefflow-16.webp resize 16 16 -- webp quality=90
sharp -i public/chefflow.png -o public/chefflow-32.webp resize 32 32 -- webp quality=90
sharp -i public/chefflow.png -o public/chefflow-180.webp resize 180 180 -- webp quality=90
sharp -i public/chefflow.png -o public/chefflow.webp resize 512 512 -- webp quality=85

# Convert chefflow_name.png to WebP (logo with text)
echo "  - chefflow_name.png (logo with text)..."
sharp -i public/chefflow_name.png -o public/chefflow_name.webp resize 1200 -- webp quality=85

# Convert chefflow_white_bg.jpg to WebP
echo "  - chefflow_white_bg.jpg (hero image)..."
sharp -i public/chefflow_white_bg.jpg -o public/chefflow_white_bg.webp resize 1920 -- webp quality=80

echo ""
echo "✨ New optimized sizes:"
ls -lh public/*.webp | awk '{print $9, $5}'

echo ""
echo "📊 Size comparison:"
echo "Before: $(du -sh public/chefflow*.{png,jpg} 2>/dev/null | awk '{sum+=$1} END {print sum "K"}')"
echo "After:  $(du -sh public/*.webp 2>/dev/null | awk '{sum+=$1} END {print sum "K"}')"

echo ""
echo "✅ Optimization complete!"
echo ""
echo "Next steps:"
echo "1. Update image references in your components to use .webp files"
echo "2. Test visually to ensure quality is acceptable"
echo "3. If satisfied, you can delete the backup: rm -rf $BACKUP_DIR"
echo "4. Commit the optimized images to git"
