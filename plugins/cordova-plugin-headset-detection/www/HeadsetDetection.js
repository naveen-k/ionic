'use strict';

var exec = require('cordova/exec');

exports.detect = function( success, error) {
  exec(success, error, 'detect', 'HeadsetDetection', []);
};


