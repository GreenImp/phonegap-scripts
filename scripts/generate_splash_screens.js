#!/usr/bin/env node

/**
 * Generates splash screens for various devices, based on
 * an original icon
 *
 * @link https://github.com/tlvince/phonegap-icon-splash-generator
 */


var exec    = require('child_process').exec;
var printf  = require('util').format;


var icon    = '../www/icon.png';    // path to the original icon to convert
var genPath = '../www/res/screen/'; // path to store the generated images

var conversionList  = {             // list of icon sizes to create
  android: [
    {
      size: '512x512',
      extent: '1280x720',
      name: 'screen-xhdpi-landscape.png'
    },
    {
      size: '256x256',
      extent: '480x800',
      name: 'screen-hdpi-portrait.png'
    },
    {
      size: '128x128',
      extent: '320x200',
      name: 'screen-ldpi-landscape.png'
    },
    {
      size: '512x512',
      extent: '720x1280',
      name: 'screen-xhdpi-portrait.png'
    },
    {
      size: '256x256',
      extent: '320x480',
      name: 'screen-mdpi-portrait.png'
    },
    {
      size: '256x256',
      extent: '480x320',
      name: 'screen-mdpi-landscape.png'
    },
    {
      size: '128x128',
      extent: '200x320',
      name: 'screen-ldpi-portrait.png'
    },
    {
      size: '256x256',
      extent: '800x480',
      name: 'screen-hdpi-landscape.png'
    }
  ],
  ios: [
    {
      size: '1024x1024',
      extent: '2048x1536',
      name: 'Default-Landscape@2x~ipad.png'
    },
    {
      size: '1024x1024',
      extent: '1536x2048',
      name: 'Default-Portrait@2x~ipad.png'
    },
    {
      size: '256x256',
      extent: '640x960',
      name: 'Default@2x~iphone.png'
    },
    {
      size: '512x512',
      extent: '1024x783',
      name: 'screen-ipad-landscape.png'
    },
    {
      size: '512x512',
      extent: '768x1004',
      name: 'screen-ipad-portrait.png'
    },
    {
      size: '256x256',
      extent: '320x480',
      name: 'screen-iphone-portrait.png'
    },
    {
      size: '1024x1024',
      extent: '1536x2008',
      name: 'screen-ipad-portrait-2x.png'
    },
    {
      size: '256x256',
      extent: '640x1136',
      name: 'screen-iphone-portrait-568h-2x.png'
    }
  ]
};

var background  = '#ffffff';        // background colour (set as 'none' for transparent)


// change to the directory where this script lives
//cd ${0%/*}

// Generate images
conversionList.forEach(function(conversions, os){
  console.log('Generating splash screens for for "' + os + '"...');

  var imageOSPath  = genPath + os + '/';  // the path to the OS specific icon directory

  // create the icon directory
  exec(printf('mkdir -p "%s"', imageOSPath));

  // loop through and generate each icon
  conversions.forEach(function(conversion){
    console.log('Generating ' + conversion.name + ' (' + conversion.size + ')');

    exec(
      printf(
        'convert -background %s %s -resize %s "%s"',
        'convert %s -background %s -gravity center -resize %s -extent %s "%s"',
        icon,
        background,
        conversion.size,
        conversion.extent,
        imageOSPath + conversion.name
      ),
      function(error, stdout, stderr){
        if(error !== null){
          console.log('Error generating ' + conversion.name + ' (' + conversion.size + '):\n' + error);
        }
      }
    );
  });

  console.log('');
});
