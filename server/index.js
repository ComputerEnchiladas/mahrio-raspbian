'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if ( process.env.NODE_ENV === 'development' ) {
    require('node-env-file')('/home/pi/mahrio-raspbian/.env');
    console.log('Running Development!');
}

var config = require('./config/env')( process.env )
  , server= require('./config/hapi')( config );

require('./config/onoff/motion_in_21');


require('./config/media/directories').getDirectory( process.env.MEDIA_DIRECTORY ).then( function(str){ console.log(str); });


require('./config/sockets')( server );

require('./routes/index')( server );

module.exports = server;
