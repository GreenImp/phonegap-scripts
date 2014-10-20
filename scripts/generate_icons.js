#!/usr/bin/env node

/**
 * Generates app icons for various devices, based on
 * an original icon
 *
 * @link https://github.com/tlvince/phonegap-icon-splash-generator
 */


var exec    = require('child_process').exec;
var printf  = require('util').format;


var icon      = '../www/icon.png';  // path to the original icon to convert
var iconPath  = '../www/res/icon/'; // path to store the converted icons

var conversionList  = {             // list of icon sizes to create
  android: [
    {
      size: '36x36',
      name: 'icon-36-ldpi.png'
    },
    {
      size: '48x48',
      name: 'icon-48-mdpi'
    },
    {
      size: '72x72',
      name: 'icon-72-hdpi'
    },
    {
      size: '96x96',
      name: 'icon-96-xhdpi'
    }
  ],
  ios: [
    {
      size: '29x29',
      name: 'icon-small.png'
    },
    {
      size: '58x58',
      name: 'icon-small@2x.png'
    },
    {
      size: '40x40',
      name: 'icon-40.png'
    },
    {
      size: '80x80',
      name: 'icon-40@2x.png'
    },
    {
      size: '50x50',
      name: 'icon-50.png'
    },
    {
      size: '100x100',
      name: 'icon-50@2x.png'
    },
    {
      size: '57x57',
      name: 'icon-57.png'
    },
    {
      size: '60x60',
      name: 'icon-60.png'
    },
    {
      size: '72x72',
      name: 'icon-72.png'
    },
    {
      size: '76x76',
      name: 'icon-76.png'
    },
    {
      size: '114x114',
      name: 'icon-114.png'
    },
    {
      size: '120x120',
      name: 'icon-120.png'
    },
    {
      size: '144x144',
      name: 'icon-144.png'
    },
    {
      size: '152x152',
      name: 'icon-152.png'
    }
  ]
};

var background  = 'none';           // background colour (set as 'none' for transparent)


// change to the directory where this script lives
//cd ${0%/*}

// Generate icons
conversionList.forEach(function(conversions, os){
  console.log('Generating icons for "' + os + '"...');

  var iconOSPath  = iconPath + os + '/';  // the path to the OS specific icon directory

  // create the icon directory
  exec(printf('mkdir -p "%s"', iconOSPath));

  // loop through and generate each icon
  conversions.forEach(function(conversion){
    console.log('Generating ' + conversion.name + ' (' + conversion.size + ')');

    exec(
      printf(
        'convert -background %s %s -resize %s "%s"',
        background,
        icon,
        conversion.size,
        iconOSPath + conversion.name
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
