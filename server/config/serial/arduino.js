var SerialPort = require('serialport'),
  arduino = new SerialPort( '/dev/ttyACM0', {
    baudRate: 115200
  }),
  sockets = null;

arduino.on('open', function(){
  console.log('arduino port on')
});

arduino.on('data', function( data ) {
  console.log('received data:'+data );
  if( sockets ) {
    sockets.emit('event:arduino:data', data);
  }
});

//setTimeout(function(){ arduino.write('Writing\n'); }, 3000);

module.exports = function( ) {
  return {
    sendCommand: function( cmd ) { arduino.write( cmd ); },
    setIOSockets: function( io ) {
      sockets = io.sockets;
    }
  }
}
