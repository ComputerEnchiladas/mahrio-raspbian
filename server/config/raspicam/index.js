var Path = require('path'),
  Promise = require('promise'),
  RaspiCam = require('raspicam');

const EXEC = Promise.denodeify( require('child_process').exec );

var camera = null,
  sockets = null,
  currentName = null,
  type = 'video',
  isAvailable = true,
  videoPath = Path.normalize(__dirname + './../../public/videos/'),
  imagePath = Path.normalize(__dirname + './../../public/img/'),
  avconv = 'avconv -r 2 -i ' + imagePath + 'myImg_%04d.jpg -r 2 -vcodec libx264 -crf 20 -g 15 ',
  MP4box = 'MP4Box  -fps 23  -add ' + videoPath + 'video.h264 ';

var startFunction = function(){
  if( !isAvailable ) { return; }
  isAvailable = false;

  if( type === 'photo' ) {
    camera.set('output', imagePath + 'myImg_' + new Date().toISOString() + '.jpg');
  } else if( type === 'video'){
    camera.set('output', videoPath + 'video.h264');
  }
  camera.start();
};
var stopFunction = function(){
  camera.stop();
};
var setModeFunction = function( mode ){	
  type = ['photo','video','timelapse'].indexOf( mode ) >= 0 ? mode : type;
  if( mode === 'photo' ) {
    camera = new RaspiCam({
      mode: 'photo',
      output: imagePath + 'image.jpg',
      height: 720,
      width: 1280,
      quality: 100
    });
  } else if( mode === 'timelapse' ){
    camera = new RaspiCam({
      mode: 'timelapse', 
      output: imagePath + 'myImg_%04d.jpg',
      height: 720,
      width: 1280,
      quality: 100,
      timeout: 60000, // record for 60 seconds
      tl: 1000	  // take a picture every 1 second
    });
  } else if( mode === 'video' ){
    camera = new RaspiCam({
      mode: 'video', 
      output: videoPath + 'video.h264',
      width: 1280,
      height: 720,
      bitrate: 3000000,
      timeout: 60000,
      framerate: 23
    });
  }
  camera.on('exit', onExit);
  camera.on('read', onRead);
  camera.on('stop', onStop); 
};
var onExit = function(){
  var currentTime = new Date().toISOString();

  isAvailable = true;

  if( sockets ) {
    sockets.emit('event:camera:done', currentTime);
  }
  
  if( type === 'video' ) {  
    EXEC(MP4box + videoPath + 'video' + currentTime + '.mp4')
      .then( function(){
	EXEC('rm ' + videoPath + 'video.h264');
      });
  } else if (type === 'timelapse') {
    EXEC(avconv + videoPath + 'timelapse' + currentTime + '.mp4')
      .then( function(){
        EXEC('rm ' + imagePath + 'myImg*');
      });
  }
};
var onRead = function(){};
var onStop = function(){};

module.exports = function( server ){
  camera = new RaspiCam({
    mode: 'video',
    output: videoPath + 'video.h264',
    width: 1280,
    height: 720,
    bitrate: 3000000,
    timeout: 60000,
    framerate: 23
  });

  camera.on('exit', onExit);

  server.route({
    method: 'GET',
    path: '/hardware/camera',
    handler: function( req, rep ){
      if( req.method === 'get' ) {
        rep({available: isAvailable ? true : false});
      } else if( req.method === 'delete' ) {
	stopFunction();
	rep({ok: true});
      } else {
	if( isAvailable && req.query.mode ) {
          setModeFunction( req.query.mode );
        }
	startFunction(); 
	rep({ok: true});
      }
    }
  });

  return {
    start: startFunction,
    stop: stopFunction,
    setIOSocket: function( io ) {
      sockets = io.sockets;
    },
    setMode: setModeFunction
  };
};
