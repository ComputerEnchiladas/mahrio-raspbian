var socket = io();

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
  .value( '_socket', socket )
  .run( ['$rootScope', 'SocketEvents', function( $rootScope, SocketEvents ) {
    SocketEvents.provision( $rootScope );
  }])
  .service('SocketEvents', [ '_socket', function( _socket) {
    this.provision = function( $rootScope ) {
      _socket.on( 'connect', function(){
        console.log('we are socket.on -> connected');
      });
      _socket.on( 'disconnect', function(){
        console.log('disconnected');
      });
      _socket.on('remote:input:up', function(){
        $rootScope.$broadcast('remote:input:up');
        console.log('UP');
      });
      _socket.on('remote:input:down', function(){
        $rootScope.$broadcast('remote:input:down');
        console.log('DOWN');
      });
      _socket.on('remote:input:left', function(){
        $rootScope.$broadcast('remote:input:left');
        console.log('LEFT');
      });
      _socket.on('remote:input:right', function(){
        $rootScope.$broadcast('remote:input:right');
        console.log('RIGHT');
      });
      _socket.on('remote:input:enter', function(){
        $rootScope.$broadcast('remote:input:enter');
        console.log('ENTER');
      });
      _socket.on('remote:in:menu', function(){
        $rootScope.$broadcast('remote:key:menu');
      });
      _socket.on('remote:in:playpause', function(){
        $rootScope.$broadcast('remote:key:playpause');
      });
      _socket.on('media:dir:list', function( list ){
        $rootScope.$broadcast('media:dir:list', list);
      });
      _socket.on('media:files:list', function( list ){
        $rootScope.$broadcast('media:files:list', list);
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
  .controller('MediaCtrl', [ '$scope', 'SocketEvents', '$document', function( $scope, SocketEvents, $document ) {
    var that = this, path = [];

    SocketEvents.getDirectories();
    SocketEvents.getFiles();
    $scope.$on('media:dir:list', function(event, list){
      $scope.$apply( function(){
        that.mediaDir = list.split('\n').filter( function(item){ return item !== ""; });
      });
    });
    $scope.$on('media:files:list', function(event, list){
      $scope.$apply( function(){
        that.mediaFiles = list.split('\n').filter( function(item){ return item !== ""; });
      });
    });
    that.searchFolder = function( folder ) {
      that.mediaDir = [];
      that.mediaFiles = [];
      path.push( folder );
      SocketEvents.getDirectories(  path.join('/') );
      SocketEvents.getFiles( path.join('/') );
    };
    that.playAll = function(){
      console.log( path );
      SocketEvents.playAll( path.length ? path.join('/') : '' );
      console.log('Play All');
    };
    that.back = function(){
      path.pop();
      that.mediaDir = [];
      that.mediaFiles = [];
      console.log('Back');
      SocketEvents.getDirectories(  path.length ? path.join('/') : '' );
      SocketEvents.getFiles( path.length ? path.join('/') : '' );
    };
  }]);
