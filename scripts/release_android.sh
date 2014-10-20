#!/bin/bash -e


# link: http://stackoverflow.com/a/20792218/1189971
# link: http://developer.android.com/tools/publishing/app-signing.html#signing-manually

# Keystore password:
# generate a keystore:
# keytool -genkey -v -keystore "$KEYSTORE" -alias "$ALIAS_NAME" -keyalg RSA -keysize 2048 -validity 10000



# Flag - Whether we want a debug or release version
IS_DEBUG=false



# Alias name used for the keystore (CHANGE THIS)
ALIAS_NAME=""

# Path to the key store
KEYSTORE="../builds/signing/ecam-realease.keystore"



if [ "$IS_DEBUG" = false ]; then
  # name of the build file
  BUILD_NAME="EnvirocheckAnalysis-release-unsigned.apk"

  # Path where unsigned app is built by Phonegap/Cordova
  BUILD_PATH="../platforms/android/ant-build/"


  # name of the build file
  RELEASE_NAME="EnvirocheckAnalysis-release-signed.apk"

  # Path to store builds, for release
  RELEASE_PATH="../../builds/"
else
  # name of the build file
  BUILD_NAME="EnvirocheckAnalysis-debug.apk"

  # Path where unsigned app is built by Phonegap/Cordova
  BUILD_PATH="../platforms/android/ant-build/"


  # name of the build file
  RELEASE_NAME="EnvirocheckAnalysis-debug.apk"

  # Path to store builds, for release
  RELEASE_PATH="../../builds/"
fi



# Change to the directory where this script lives
cd ${0%/*}


# Create directories
mkdir -p "../../builds"



# check that a keystore file exists before building
if [ "$IS_DEBUG" = false ]; then
  if [[ ! -a $KEYSTORE ]]; then
    echo "No keystore/private key could be found, please create one before building"
    exit 0;
  fi
fi



# Check if we have Phonegap or Cordova
phonegap=$(phonegap -v)
if [[ $? != 0 || -z $phonegap ]]; then
  # command failed or Phonegap not installed - try cordova
  echo "Phonegap not detected - use Cordova"

  # Build the project
  echo "Building project"
  if [ "$IS_DEBUG" = false ]; then
    # Create a release
    echo "Building release APK"
    cordova build --release --device android
  else
    # Create a debug APK
    echo "Building debug APK"
    cordova build --device android
  fi
else
  # Phonegap exists
  echo "Phonegap detected"

  # Build the project
  echo "Building project"
  phonegap build --device android



  if [ "$IS_DEBUG" = false ]; then
    # Create release version
    echo "Converting to release APK"
    ../platforms/android/cordova/build --release
  fi
fi



# Check for errors
if [[ $? != 0 ]]; then
  echo "Error building app - check for any errors above"
  exit 0;
fi



# Copy the APK to the builds folder
echo "Adding APK to 'builds' directory"
cp "${BUILD_PATH}${BUILD_NAME}" "${RELEASE_PATH}${BUILD_NAME}"


if [ "$IS_DEBUG" = false ]; then
  # sign the app with a private key
  # TODO - if statement around signing
  echo "Signing the app"
  jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "$KEYSTORE" "${RELEASE_PATH}${BUILD_NAME}" "$ALIAS_NAME"

  # verify that the APK is signed
  # TODO - if statement around verification
  jarsigner -verify -verbose -certs "${RELEASE_PATH}${BUILD_NAME}"

  # align the API package
  echo "Aligning the app package"
  zipalign -v 4 "${RELEASE_PATH}${BUILD_NAME}" "${RELEASE_PATH}${RELEASE_NAME}"


  # remove the un-aligned package
  rm ${RELEASE_PATH}${BUILD_NAME}
fi
