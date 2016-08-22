'use strict';

var child = require('child_process')
  , promise = require('promise');

var readDirectory = promise.denodeify( child.exec );

module.exports = {
  getDirectories: function( dir ) {
    return readDirectory('ls -p '+dir+' | grep "/"');
  },
  getFiles: function( dir ){
    return readDirectory('ls -p '+dir+' | grep -v /');
  },
  getAllFiles: function( dir ){
    return readDirectory('find '+dir+' -type f -name "*.mp4"');
  },
  gotoDirectory: function( dir ) { }
};
