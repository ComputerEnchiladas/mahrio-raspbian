'use strict';


module.exports = function( server ) {
    server.route({
        method: 'GET',
        path: '/bower_components/{param*}',
        handler: {
            directory: {
                path: ['../public/bower_components'],
                defaultExtension: 'html'
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/assets/{param*}',
        handler: {
            directory: {
                path: ['../public'],
                defaultExtension: 'html'
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/partials/{param*}',
        handler: {
            directory: {
                path: ['../public/html/'],
                defaultExtension: 'html'
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/favicon.ico',
        handler: {
            file: '../public/img/favicon.ico'
        }
    });
    server.route({
        method: 'GET',
        path: '/{any*}',
        handler: function( req, rep ) {
            rep.view('index');
        }
    });
};