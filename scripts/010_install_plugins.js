#!/usr/bin/env node

var sys = require('sys');
var exec = require('child_process').exec;

/**
 * List of plugins to install
 *
 * @type {Array}
 */
var plugins = [
  "org.apache.cordova.camera",
  "org.apache.cordova.device",
  "org.apache.cordova.file",
  "org.apache.cordova.file-transfer",
  "org.apache.cordova.geolocation",
  "org.apache.cordova.InAppBrowser",
  "org.apache.cordova.media",
  "org.apache.cordova.media-capture",
  "org.apache.cordova.network-information",
  "com.ionic.keyboard"
];


/**
 * Handle command output
 *
 * @param error
 * @param stdout
 * @param stderr
 */
function puts(error, stdout, stderr){
  sys.puts(stdout);
}


// check if we're running Phonegap or Cordova
exec('phonegap -v', function(error, stdout, stderr){
  var hasPhonegap = !error && stdout && !stderr;

  // loop through and install the plugins
  plugins.forEach(function(plugin){
    if(hasPhonegap){
      exec("phonegap local plugin add " + plugin, puts);
    }else{
      exec("cordova plugin add " + plugin, puts);
    }
  });
});
