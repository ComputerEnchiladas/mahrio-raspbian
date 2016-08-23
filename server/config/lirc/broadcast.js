'use static';

const RMT = [
    'remote:input:up',
    'remote:input:down',
    'remote:input:left',
    'remote:input:right',
    'remote:input:enter',
    'remote:input:menu',
    'remote:input:playpause'
];

module.exports = function( io, remote){
  remote.on( RMT[0], function(){ io.sockets.emit(RMT[0]);});
  remote.on( RMT[1], function(){ io.sockets.emit(RMT[1]);});
  remote.on( RMT[2], function(){ io.sockets.emit(RMT[2]);});
  remote.on( RMT[3], function(){ io.sockets.emit(RMT[3]);});
  remote.on( RMT[4], function(){ io.sockets.emit(RMT[4]);});
  remote.on( RMT[5], function(){ io.sockets.emit(RMT[5]);});
  remote.on( RMT[6], function(){ io.sockets.emit(RMT[6]);});
};
