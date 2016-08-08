'use strict';

var Path = require('path'),
    rootPath = Path.normalize(__dirname + '/../');

module.exports = function( env ) {
    var environmentsObject =  {
        development: {
            datastoreURI: env.MONGODB_DATASTORE_URI,
            port: 8042
        },
        production: {
            datastoreURI: env.MONGOLAB_URI
        }
    }, environment = environmentsObject[ env.NODE_ENV || 'development' ];

    environment.rootPath = rootPath;
    environment.type = env.NODE_ENV || 'development';
    environment.port = env.PORT || env.NODE_PORT || environment.port;
    environment.url = env.NODE_URL;

    return environment;
};