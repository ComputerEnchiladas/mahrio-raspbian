var gpio = require('onoff').Gpio
  , motion = new gpio(21, 'in', 'both');

motion.watch( function(err, val){
  if( err ) { console.log('Motion in 21 Error'); return; }

  console.log('Motion in 21 is ' + (val ? 'ACTIVE' : 'INACTIVE') +': ' + new Date().toLocaleString() );

});

process.on('SIGINT', function(){
  motion.unexport();
  process.exit();
});
