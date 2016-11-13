var RaspiCam = require('raspicam');
const exec = require('child_process').exec;
var Path = require('path');

var camera = null, counter = 0;

module.exports = function( name, timeout){
  camera = new RaspiCam({
    mode: 'video',
    output: name,
    width: 1280,
    height: 720,
    bitrate: 3000000,
    timeout: timeout,
    framerate: 23
  });

  camera.on('exit', function(){
    console.log('stopped');
    //camera.stop();

    var videoPath = Path.normalize(__dirname + './../../public/videos/');
    console.log('MP4Box  -fps 23  -add '+name+' '+videoPath+'video'+counter+'.mp4');
    //sudo apt-get install gpac
    exec('MP4Box  -fps 23  -add '+name+' '+videoPath+'video'+counter+'.mp4', function(){
     	counter = counter + 1; 
	exec('rm ' + name);
    });
  });

  return {
    start: function(){
      console.log('starting');
      camera.start();
    },
    stop: function(){
      camera.stop();
    }
  };
};
