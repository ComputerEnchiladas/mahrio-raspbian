'use static';

var REMOTE = [
    'remote:input:up',
    'remote:input:down',
    'remote:input:left',
    'remote:input:right',
    'remote:input:enter'
];

module.exports = function( io, remote){
    for( var i = 0, l = REMOTE.length; i < l; i++){
        remote.on( REMOTE[i], function(){
           io.emit( REMOTE[i] );
        });
    }
};