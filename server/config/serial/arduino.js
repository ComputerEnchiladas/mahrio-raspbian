var SerialPort = require('serialport'),
  path = require('path'),
  arduino = {},
  arduinoDevice = '/dev/ttyACM0',
  sockets = null;

if( path.existsSync( arduinoDevice ) ) {
  arduino = new SerialPort( arduinoDevice, {
    baudRate: 115200
  });
} else {
  arduino = { on: function(){}, write: function(){} };
}

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
