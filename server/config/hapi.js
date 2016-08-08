'use strict';

const Hapi = require('hapi');
const Path = require('path');
const GoodConsole = require('good-console');
const Good = require('good');

const server = new Hapi.Server();

module.exports = function( config ) {

    var serverConfig = {
        port: config.port,
        routes: {
            files: {
                relativeTo: Path.join(config.rootPath, 'public')
            }
        }
    };

    if( config.url ) {
        serverConfig.host = config.url;
    }

    server.connection( serverConfig );

    server.register({
        register: Good,
        options: {
            reporters: [{
                reporter: GoodConsole,
                events: {
                    response: '*',
                    log: '*'
                }
            }]
        }
    }, function(err) {
        if (err) {
            throw err; // something bad happened loading the plugin
        }

        server.start(function(err) {
            if (err) {
                throw err;
            }
            console.log('Server running at:', server.info.uri);
        });
    });

    server.views({
        engines: { ejs: require('ejs') },
        path: Path.join(__dirname, '../views')
    });

    return server;
};