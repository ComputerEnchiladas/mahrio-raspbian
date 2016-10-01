var gpio = require('onoff').Gpio
  , button = new gpio(19, 'in', 'both');

button.watch( function(err, val){
  if( err ) { console.log('Button in 19 Error'); return; }

  console.log('Button in 19 is ' + (!val ? 'ACTIVE' : 'INACTIVE') +': ' + new Date().toLocaleString() );

});

process.on('SIGINT', function(){
  button.unexport();
  process.exit();
});
