'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if ( process.env.NODE_ENV === 'development' ) {
    require('node-env-file')('./.env');
    console.log('Running Development!');
}

var config = require('./config/env')( process.env )
  , server= require('./config/hapi')( config );

//require('./config/onoff/motion_in_21');

var dirAPI = require('./config/media/directories')
  , omx = require('./config/omxdirector/index');

require('./config/lirc/index')( omx );
require('./config/sockets')( server, {dir: dirAPI, omx: omx});

require('./routes/index')( server );

module.exports = server;
