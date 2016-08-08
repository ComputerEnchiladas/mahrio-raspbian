'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if ( process.env.NODE_ENV === 'development' ) {
    require('node-env-file')('.env');
    console.log('Running Development!');
}

var config = require('./config/env')( process.env )
    , server = require('./config/hapi')( config );

require('./routes/index')( server );

module.exports = server;