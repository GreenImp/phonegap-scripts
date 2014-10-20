#!/bin/bash -e

# Path to the icon to convert
ICON="../www/icon.png"

# The background colour of the splash screen
BACKGROUND_COLOUR="#FFFFFF"

# Output the commands being executed
set -x

# Change to the directory where this script lives
cd ${0%/*}

# Create directories
mkdir -p "../www/res/screen/android"
mkdir -p "../www/res/screen/ios"

# Generate splash screens
convert $ICON -background $BACKGROUND_COLOUR -gravity center -resize 512x512 -extent 1280x720 "../www/res/screen/android/screen-xhdpi-landscape.png"
convert $ICON -background $BACKGROUND_COLOUR -gravity center -resize 256x256 -extent 480x800 "../www/res/screen/android/screen-hdpi-portrait.png"
convert $ICON -background $BACKGROUND_COLOUR -gravity center -resize 128x128 -extent 320x200 "../www/res/screen/android/screen-ldpi-landscape.png"
convert $ICON -background $BACKGROUND_COLOUR -gravity center -resize 512x512 -extent 720x1280 "../www/res/screen/android/screen-xhdpi-portrait.png"
convert $ICON -background $BACKGROUND_COLOUR -gravity center -resize 256x256 -extent 320x480 "../www/res/screen/android/screen-mdpi-portrait.png"
convert $ICON -background $BACKGROUND_COLOUR -gravity center -resize 256x256 -extent 480x320 "../www/res/screen/android/screen-mdpi-landscape.png"
convert $ICON -background $BACKGROUND_COLOUR -gravity center -resize 128x128 -extent 200x320 "../www/res/screen/android/screen-ldpi-portrait.png"
convert $ICON -background $BACKGROUND_COLOUR -gravity center -resize 256x256 -extent 800x480 "../www/res/screen/android/screen-hdpi-landscape.png"


convert $ICON -background $BACKGROUND_COLOUR -gravity center -resize 1024x1024 -extent 2048x1536 "../www/res/screen/ios/Default-Landscape@2x~ipad.png"
convert $ICON -background $BACKGROUND_COLOUR -gravity center -resize 1024x1024 -extent 1536x2048 "../www/res/screen/ios/Default-Portrait@2x~ipad.png"
convert $ICON -background $BACKGROUND_COLOUR -gravity center -resize 256x256 -extent 640x960 "../www/res/screen/ios/Default@2x~iphone.png"

convert $ICON -background $BACKGROUND_COLOUR -gravity center -resize 512x512 -extent 1024x783 "../www/res/screen/ios/screen-ipad-landscape.png"
convert $ICON -background $BACKGROUND_COLOUR -gravity center -resize 512x512 -extent 768x1004 "../www/res/screen/ios/screen-ipad-portrait.png"
convert $ICON -background $BACKGROUND_COLOUR -gravity center -resize 256x256 -extent 320x480 "../www/res/screen/ios/screen-iphone-portrait.png"
convert $ICON -background $BACKGROUND_COLOUR -gravity center -resize 1024x1024 -extent 1536x2008 "../www/res/screen/ios/screen-ipad-portrait-2x.png"
convert $ICON -background $BACKGROUND_COLOUR -gravity center -resize 256x256 -extent 640x1136 "../www/res/screen/ios/screen-iphone-portrait-568h-2x.png"
