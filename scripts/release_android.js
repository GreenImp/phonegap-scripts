#!/usr/bin/env node


/**
 * Generates Android APKs
 *
 * @link http://stackoverflow.com/a/20792218/1189971
 * @link link: http://developer.android.com/tools/publishing/app-signing.html#signing-manually
 */

/**
 * To generate a keystore:
 * $ keytool -genkey -v -keystore "{KEYSTORE_NAME}" -alias "{KEYSTORE_ALIAS_NAME}" -keyalg RSA -keysize 2048 -validity 10000
 */


var exec    = require('child_process').exec;
var printf  = require('util').format;



var IS_DEBUG      = false;                // Flag - Whether we want a debug or release version

var keystoreAlias = '';                   // Alias name used for the keystore (CHANGE THIS)
var keystorePath  = 'keystore.keystore';  // Path to the key store

var appFileName = '',                                 // the file name for the app
    buildName,                                        // name of the build file
    buildPath   = '../platforms/android/ant-build/',  // path where unsigned app is built by Phonegap/Cordova
    releaseName,                                      // name of the build file
    releasePath = '../builds/';                       // path to store builds, for release



if(!IS_DEBUG){
  buildName     = appFileName + '-release-unsigned.apk';
  releaseName   = appFileName + '-release-signed.apk';

  buildPathName = buildPath + buildName;
}else{
  buildName = appFileName + '-debug.apk';
  releaseName = appFileName + '-debug.apk';
}



// change to the directory where this script lives
//cd ${0%/*}


// create release directory
exec(printf('mkdir -p "%s"', releasePath));



// check that a keystore file exists before building
// TODO - check for keystore file
/*if(!$IS_DEBUG){
  if [[ ! -a $KEYSTORE ]]; then
    echo "No keystore/private key could be found, please create one before building"
    exit 0;
  fi
}*/



// check if we're running Phonegap or Cordova
exec('phonegap -v', function(error, stdout, stderr){
  if(!error && stdout && !stderr){
    // we have Phonegap
    console.log('Phonegap detected');

    // build the project
    console.log('Building debug APK');
    exec('phonegap build --device android');


    if(!IS_DEBUG){
      // create release version
      console.log('Converting to release APK');
      exec('../platforms/android/cordova/build --release');
    }
  }else{
    // command failed or Phonegap not installed - try cordova
    console.log('Phonegap not detected - use Cordova');

    // build the project
    console.log('Building project');

    if(!IS_DEBUG){
      // create a release
      console.log('Building release APK');
      exec('cordova build --release --device android');
    }else{
      // create a debug APK
      console.log('Building debug APK');
      exec('cordova build --device android');
    }
  }
});


/*# Check for errors
if [[ $? != 0 ]]; then
  echo "Error building app - check for any errors above"
  exit 0;
fi*/



// copy the APK to the builds folder
console.log('Adding APK to "builds" directory');
exec(printf('cp "%s" "%s"', buildPath + buildName, releasePath + buildName));


if(!IS_DEBUG){
  // sign the app with a private key
  console.log('Signing the app');
  exec(printf(
    'jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "%s" "%s" "%s"',
    keystorePath,
    releasePath + buildName,
    keystoreAlias
  ), function(error, stdout, stderr){
    if(error !== null){
      // error signing the app
      console.log('Error signing the app: ' + error);
    }else{
      // app signed successfully - verify it

      // verify that the APK is signed
      // TODO - if statement around verification
      exec(printf('jarsigner -verify -verbose -certs "%s"', releasePath + buildName));


      // align the API package
      console.log("Aligning the app package");
      exec(printf(
        'zipalign -v 4 "%s" "%s"',
        releasePath + buildName,
        releasePath + releaseName
      ));


      // remove the un-aligned package
      console.log('Removing un-aligned package');
      exec(printf('rm "%s"', releasePath + buildName));
    }
  });
}
