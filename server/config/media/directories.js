'use strict';

var child = require('child_process')
  , promise = require('promise');

var readDirectory = promise.denodeify( child.exec );

module.exports = {
  getDirectory: function( dir ) { 
    return readDirectory('ls -1 ' + dir);
  },
  gotoDirectory: function( dir ) { }
}
