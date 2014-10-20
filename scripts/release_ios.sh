#!/bin/bash -e



# For build errors relating to "precompiled header", see the following:
# https://github.com/MobileChromeApps/mobile-chrome-apps/issues/327
# http://stackoverflow.com/a/16547411/1189971



# Flag - Whether we want a debug or release version
IS_DEBUG=false



# File name for the app build
APP_FILE_NAME=""

if [ "$IS_DEBUG" = false ]; then
  # Path to the provisioning profile
  PROVISIONING_PROFILE="../../builds/signing/Landmark_ECAM_2014_App_Store.mobileprovision"

  # The name of the certificate to use (this should match a certificate in your Keychain - it can be a partial match)
  SIGNING_CERTIFICATE="iPhone Distribution"
else
  # Path to the provisioning profile
  PROVISIONING_PROFILE="../../builds/signing/Landmark_ECAM_2014_Development.mobileprovision"

  # The name of the certificate to use (this should match a certificate in your Keychain - it can be a partial match)
  SIGNING_CERTIFICATE="iPhone Developer"
fi



# TestFlight config

# The TestFlight API token (from https://www.testflightapp.com/account/#api)
TESTFLIGHT_API_TOKEN="..."

# The TestFlight team token (from https://www.testflightapp.com/dashboard/team/edit/)
TESTFLIGHT_TEAM_TOKEN="..."

# Release notes
RELEASE_NOTES="This build was uploaded via the upload API"

# Whether to notify members of the team (True/False)
NOTIFY="False"



# Path where unsigned app is built by Phonegap/Cordova
BUILD_PATH="../platforms/ios/build/device/${APP_FILE_NAME}.app"

if [ "$IS_DEBUG" = false ]; then
  # Path to store builds, for release
  RELEASE_PATH="../../builds/${APP_FILE_NAME}-release.ipa"
else
  # Path to store builds, for release
  RELEASE_PATH="../../builds/${APP_FILE_NAME}-debug.ipa"
fi


# Change to the directory where this script lives
cd ${0%/*}


# Create directories
mkdir -p "../../builds"


# Check if we have Phonegap or Cordova
phonegap=$(phonegap -v)
if [[ $? != 0 || -z $phonegap ]]; then
  # command failed or Phonegap not installed - try cordova
  echo "Phonegap not detected - use Cordova"

  # Build the project
  echo "Building project"
  cordova build --release --device ios
else
  # Phonegap exists
  echo "Phonegap detected"

  # Build the project
  echo "Building project"
  phonegap build --device ios

  if [[ $? != 0 ]]; then
    echo "Error building initial app - check for any errors above"
    exit 0;
  fi

  # convert to a proper release
  echo "Converting to release"
  ../platforms/ios/cordova/build --release --device
fi


# Check for errors
if [[ $? != 0 ]]; then
  echo "Error building release app - check for any errors above"
  exit 0;
fi


# Check for the build file
if [[ -a $BUILD_PATH ]]; then
  echo "Build file found"

  # Package the application, embed the provisioning profile, and sign
  echo "Packaging app (embedding provisioning profile and signing)"
  xcrun -sdk iphoneos PackageApplication -v "$BUILD_PATH" -o "$(pwd)/${RELEASE_PATH}" --embed "$PROVISIONING_PROFILE" --sign "$SIGNING_CERTIFICATE"

  # Upload the application to TestFlight
  #echo "Uploading to TestFlight"
  #curl http://testflightapp.com/api/builds.json -F file=@../${APP_FILE_NAME}.ipa -F api_token="$TESTFLIGHT_API_TOKEN" -F team_token="$TESTFLIGHT_TEAM_TOKEN" -F notes="$RELEASE_NOTES" -F replace=True -F notify=$NOTIFY
else
  # File not found
  echo "Build file not found - check for any errors above"
fi
