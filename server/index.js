'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if ( process.env.NODE_ENV === 'development' ) {
    require('node-env-file')('./.env');
    console.log('Running Development!');
}

const CONFIG = require('./config/env')( process.env )
    , SERVER = require('./config/hapi')( CONFIG )
    , events = require('events');

var remote = new events.EventEmitter();

//require('./config/onoff/motion_in_21');
require('./config/onoff/button_in_19');

const HARDWARE = {
    dirAPI: require('./config/media/directories'),
    omx: require('./config/omxdirector/index'),
    camera: require('./config/raspicam/index')( SERVER )
};

var io = require('./config/sockets')( SERVER, HARDWARE, remote);

require('./config/lirc/index')( HARDWARE.omx, remote );
require('./config/lirc/broadcast')( io, remote);



require('./routes/index')( SERVER );

module.exports = SERVER;
