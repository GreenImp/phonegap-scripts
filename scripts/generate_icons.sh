#!/bin/bash -e

# Path to the icon to convert
ICON="../www/icon.png"

# Output the commands being executed
set -x

# Change to the directory where this script lives
cd ${0%/*}

# Create directories
mkdir -p "../www/res/icon/android"
mkdir -p "../www/res/icon/ios"

# Generate icon
convert -background none $ICON -resize 36x36 "../www/res/icon/android/icon-36-ldpi.png"
convert -background none $ICON -resize 48x48 "../www/res/icon/android/icon-48-mdpi.png"
convert -background none $ICON -resize 72x72 "../www/res/icon/android/icon-72-hdpi.png"
convert -background none $ICON -resize 96x96 "../www/res/icon/android/icon-96-xhdpi.png"

convert -background none $ICON -resize 29x29 "../www/res/icon/ios/icon-small.png"
convert -background none $ICON -resize 58x58 "../www/res/icon/ios/icon-small@2x.png"
convert -background none $ICON -resize 40x40 "../www/res/icon/ios/icon-40.png"
convert -background none $ICON -resize 80x80 "../www/res/icon/ios/icon-40@2x.png"
convert -background none $ICON -resize 50x50 "../www/res/icon/ios/icon-50.png"
convert -background none $ICON -resize 100x100 "../www/res/icon/ios/icon-50@2x.png"
convert -background none $ICON -resize 57x57 "../www/res/icon/ios/icon-57.png"
convert -background none $ICON -resize 60x60 "../www/res/icon/ios/icon-60.png"
convert -background none $ICON -resize 72x72 "../www/res/icon/ios/icon-72.png"
convert -background none $ICON -resize 76x76 "../www/res/icon/ios/icon-76.png"
convert -background none $ICON -resize 114x114 "../www/res/icon/ios/icon-114.png"
convert -background none $ICON -resize 120x120 "../www/res/icon/ios/icon-120.png"
convert -background none $ICON -resize 144x144 "../www/res/icon/ios/icon-144.png"
convert -background none $ICON -resize 152x152 "../www/res/icon/ios/icon-152.png"
