#!/usr/bin/env node


/**
 * Generates IOS IPAs
 *
 * For build errors relating to "precompiled header", see the following:
 *  https://github.com/MobileChromeApps/mobile-chrome-apps/issues/327
 *  http://stackoverflow.com/a/16547411/1189971
 * It can usually be resolved by deleting the directory referenced in the error
 */



/* ==========================================================================
 * Config settings
 * ========================================================================== */

var IS_DEBUG              = false;    // Flag - Whether we want a debug or release version

var signingCertificate    = '';       // The name of the certificate to use (this should match a certificate in your Keychain - it can be a partial match)
var provisioningProfiles  = {         // path to the provisioning profiles (`debug` and `release`)
  debug: 'profile.mobileprovision',
  release: 'profile.mobileprovision'
};

var appFileName           = '';       // the file name for the app
var rootPath              = '../';    // path from this file to the app root (folder hat contains the `www` directory)



// TestFlight config
testflight = {
  pushBuild: false,   // flag - whether to push the build to Testflight or not
  apiToken: '',       // TestFlight API token (from https://www.testflightapp.com/account/#api)
  teamToken: '',      // TestFlight team token (from https://www.testflightapp.com/dashboard/team/edit/)
  releaseNotes: '',   // release notes
  notify: false       // flag - whether to notify members of the team
};



/* ==========================================================================
 * Do NOT modify the code below
 * ========================================================================== */

var exec    = require('child_process').exec;
var printf  = require('util').format;



var buildName   = appFileName + '.app',                     // name of the build file
    buildPath   = rootPath + 'platforms/ios/build/device/', // path where unsigned app is built by Phonegap/Cordova
    releaseName,                                            // name of the build file
    releasePath = rootPath + 'builds/',                     // path to store builds, for release
    provisioningProfilePath;                                // path to the provisioning profile


if(!IS_DEBUG){
  releaseName = appFileName + '-release.ipa';

  // set the provisioning profile
  provisioningProfilePath = provisioningProfiles.release || provisioningProfiles;

  // set default signing certificate if none is defined
  signingCertificate  = signingCertificate || "iPhone Distribution"
}else{
  releaseName = appFileName + '-debug.ipa';

  // set the provisioning profile
  provisioningProfilePath = provisioningProfiles.debug || provisioningProfiles;

  // set default signing certificate if none is defined
  signingCertificate  = signingCertificate || "iPhone Developer"
}


//# Change to the directory where this script lives
//cd ${0%/*}


// create release directory
exec(printf('mkdir -p "%s"', releasePath));



// check if we're running Phonegap or Cordova
exec('phonegap -v', function(error, stdout, stderr){
  if(!error && stdout && !stderr){
    // we have Phonegap
    console.log('Phonegap detected');

    // build the project
    console.log('Building debug app');
    exec('phonegap build --device ios', function(error, stdout, stderr){
      if(error === null){
        console.log('Error building initial app - check for any errors above');
      }else{
        // create release version
        console.log('Converting to release app');
        exec('../platforms/ios/cordova/build --release --device');
      }
    });
  }else{
    // command failed or Phonegap not installed - try cordova
    console.log('Phonegap not detected - use Cordova');

      // create a release
    console.log('Building release app');
    exec('cordova build --release --device ios');
  }
});


/*# Check for errors
if [[ $? != 0 ]]; then
  echo "Error building release app - check for any errors above"
  exit 0;
fi*/


// heck for the build file
//if [[ -a $BUILD_PATH ]]; then
  // package the application, embed the provisioning profile, and sign it
  console.log("Packaging app (embedding provisioning profile and signing)");
  exec(
    printf(
      'xcrun -sdk iphoneos PackageApplication -v "%s" -o "$(pwd)/%s" --embed "%s" --sign "%s"',
      buildPath + buildName,
      releasePath + releaseName,
      provisioningProfilePath,
      signingCertificate
    ),
    function(error, stdout, stderr){
      if(error !== null){
        console.log('Error signing app: ' + error);
      }else{
        console.log('App signed successfully');

        if(testflight && testflight.pushBuild){
          // we need to push the build to Testflight
          console.log('Uploading to TestFlight');
          exec(printf(
            'curl http://testflightapp.com/api/builds.json -F file=@"%s" -F api_token="%s" -F team_token="%s" -F notes="%s" -F replace=True -F notify=%s'),
            releasePath + releaseName,
            testflight.apiToken,
            testflight.teamToken,
            testflight.releaseNotes,
            testflight.notify ? 'True' : 'False'
          );
        }
      }
    }
  );
/*else
  # File not found
  echo "Build file not found - check for any errors above"
fi*/
