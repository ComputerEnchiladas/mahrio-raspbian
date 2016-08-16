'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if ( process.env.NODE_ENV === 'development' ) {
    require('node-env-file')('/home/pi/Startup/mahrio-raspbian/.env');
    console.log('Running Development!');
}

var config = require('./config/env')( process.env )
    , hardware = require('./config/sensor')
    , server= require('./config/hapi')( config );

require('./config/sockets')( server );

require('./routes/index')( server, hardware );

module.exports = server;
