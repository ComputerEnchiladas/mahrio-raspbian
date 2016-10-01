(function(){
  'use strict';

  angular.module('mahrio', ['ngRoute'])
    .config(['$routeProvider',
      function($routeProvider) {
        $routeProvider.when('/app', {
          templateUrl: '/partials/app.html',
          controller: 'AppCtrl as vm'
        }).when('/app/media', {
          templateUrl: '/partials/media.html',
          controller: 'MediaCtrl as vm'
        }).otherwise({
          redirectTo: '/app'
        });
      }
    ])
    .value( '_socket', io() )
    .factory('Media', [ function(){
      var allMedia = [], selected = [0,0], rows = 0, columns = 4, btnBack = null;

      return {
        socketUpdate: false,
        remoteInput: function( direction ) {
	  if( selected[0] > 0 ) {
            allMedia[ ((selected[0] - 1) * 4) + (selected[1] - 1) ].selected = false;
	  }
          switch( direction ) {
            case 'up':
	      if( selected[0] === 1 ) { window.scrollTo(0,0); btnBack = true; }
              if( selected[0] > 0) { selected[0]--; }
              break;
            case 'down':
              if( selected[0] < rows) { selected[0]++; }
              break;
            case 'left':
	      if( selected[0] === 0 ) { btnBack = !btnBack; }
              else if( selected[1] > 1) { selected[1]--; }
              break;
            case 'right':
	      if( selected[0] === 0 ) { btnBack = !btnBack; }
              else if( selected[1] < 4) { selected[1]++; }
              break;
          }
	  if( selected[0] > 0 ) {
            allMedia[ ((selected[0] - 1) * 4) + (selected[1] - 1) ].selected = true;
	  }
          this.socketUpdate = true;
        },
        getAllMedia: function(){
          return allMedia;
        },
	isMenu: function(){
	  return selected[0] === 0;
	},
	getBackBtn: function(){
	  return btnBack;
	},
        setFromSocket: function(list){
          var directories = list.directories.split('\n').filter( function(item){ return item !== ""; })
            , files = list.files.split('\n').filter( function(item){ return item !== ""; });

          allMedia = directories.concat(files).map( function(media, i){
            return {
              selected: !i ? true : false,
              row: (i / 4) + 1,
              column: (i % 4) + 1,
              type: (i < directories.length ? 'directory' : 'file'),
              name: media
            }
          });

          selected = [1,1];
          rows = (allMedia.length / 4) + (allMedia.length % 4 !== 0 ? 1 : 0);
          this.socketUpdate = true;
        }
      };
    }])
    .run( ['Media', 'SocketEvents', function( Media, SocketEvents ) {
      SocketEvents.provision( );
      SocketEvents.provisionRemote( Media );
      SocketEvents.provisionMedium( Media );
    }])
    .service('SocketEvents', [ '$rootScope', '_socket', '$document', function( $rootScope, _socket, $document) {
      this.provision = function( ) {
        _socket.on('connect', function () {
          console.log('we are socket.on -> connected');
        });
        _socket.on('disconnect', function () {
          console.log('disconnected');
        });
      };
      this.provisionRemote = function(  media ) {
        _socket.on('remote:input:up', function () {
          media.remoteInput( 'up' );
          console.log('UP');
          $rootScope.$digest();
        });
        _socket.on('remote:input:down', function () {
          media.remoteInput( 'down' );
          console.log('DOWN');
          $rootScope.$digest();
        });
        _socket.on('remote:input:left', function () {
          media.remoteInput( 'left' );
          console.log('LEFT');
          $rootScope.$digest();
        });
        _socket.on('remote:input:right', function () {
          media.remoteInput( 'right' );
          console.log('RIGHT');
          $rootScope.$digest();
        });
        _socket.on('remote:input:enter', function () {
	  try {
            document.querySelector('li.active > a').click();
	  } catch(e) {
	    document.querySelector('button.btn-primary').click();
	  }
          console.log('ENTER');
        });
        _socket.on('remote:input:menu', function () {
          //$rootScope.$broadcast('remote:input:menu');
        });
        _socket.on('remote:input:playpause', function () {
          //$rootScope.$broadcast('remote:input:playpause');
        });
      };
      this.provisionMedium = function( media ) {
        _socket.on('media:all:list', function( list ){
          media.setFromSocket( list );
          $rootScope.$digest();
        });
      };
      this.getDirectories = function( dir ){
        _socket.emit('get:media:dir', dir);
      };
      this.getFiles = function( dir ){
        _socket.emit('get:media:files', dir);
      };
      this.playAll = function( dir ) {
        _socket.emit('play:all:dir', dir);
      };
      this.playOne = function( file ) {
        _socket.emit('play:one:file', file);
      };
      this.getAllMedia = function( dir ){
        _socket.emit('get:media:all', dir);
      }
    }])

    .controller('AppCtrl', [ function( ){
      var that = this;

      that.menuItems = [{
        name: 'Media',
        active: true,
        link: '/app/media'
      },{
        name: 'Motion',
        active: false
      },{
        name: 'Other',
        active: false
      }];

      that.processKey = function( $event){
        console.log('KEY PRESSED', $event);
      };
    }])
    .controller('MediaCtrl', [ '$scope', 'SocketEvents', 'Media', function( $scope, SocketEvents, Media ) {
      var that = this, path = [];

      SocketEvents.getAllMedia();
      $scope.$watch( function(){ return Media.socketUpdate; }, function(newVal){
        if( newVal ) {
          that.media = Media.getAllMedia();
          Media.socketUpdate = false;
	  if( Media.isMenu() ) {
	    that.backBtn = Media.getBackBtn();
	  } else {
	    that.backBtn = null;
	  }
        }
      });
      that.searchFolder = function( item ) {
        if( item.type !== 'directory'){
          SocketEvents.playOne( path.join('/') + item.name );
          return;
        }

        that.media = [];
        path.push( item.name );
        SocketEvents.getAllMedia( path.join('/') );
      };
      that.playAll = function(){
        SocketEvents.playAll( path.length ? path.join('/') : '' );
      };
      that.back = function(){
        path.pop();
        that.media = [];
        SocketEvents.getAllMedia( path.join('/') );
      };
    }])
    .directive('updateOnActive', [ function( ) {
      return {
	scope: {
	  active: '='
	},
	link: function( scope, elem ) {
	  scope.$watch( function() {
	    return scope.active;
	  }, function(newVal, oldVal) {
	    if( newVal ) {
	      window.scrollTo( 0, elem[0].offsetTop - 10 );
	    }	
	  });
	}
      };
    }]);
})();

