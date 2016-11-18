angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})
  .controller('SearchCtrl', function($scope, $ionicModal, $http, $timeout){
    $scope.working = false;
    $scope.$on('$ionicView.enter', function(e) {
      $http.get('http://192.168.0.6:8080/hardware/camera')
        .then( function(res){
          if( !res.data.available ) {
            console.log( 'in here', res.data.available);
            $scope.working = true;
          }
          $scope.mode = res.data.mode;
        });
    });
    $scope.command = function( str ){
      $scope.working = true;
      socket.emit( 'remote:input:' + str );
    };
    socket.on('event:camera:done', function( currentTime ){
      var url = 'http://192.168.0.6:8080/assets/videos/';
      $scope.$apply( function(){
        if( $scope.mode === 'photo') {
          url = 'http://192.168.0.6:8080/assets/img/';
          $scope.path = url + 'myImg_'+currentTime+'.jpg';
        } else if( $scope.mode === 'timelapse'){
          $scope.path = url + 'timelapse'+currentTime+'.mp4';
        } else {
          $scope.path = url + 'video'+currentTime+'.mp4';
        }
        $scope.working = false;
      });
    });
    $scope.openCameraSettings = function(){
      $scope.modal.show();
    };
    $scope.openCameraPlayback = function(){
      $ionicModal.fromTemplateUrl('templates/modal/cameraPlayback.html', function(modal){
          $scope.modalPlayback = modal;
          $scope.modalPlayback.show();
        },
        {
          scope: $scope
        });
    };
    $scope.closeCameraSettings = function( mode ) {
      $scope.modal.hide();
    };
    $scope.closeCameraPlayback = function( mode ) {
      $scope.modalPlayback.remove();
    };
    $ionicModal.fromTemplateUrl('templates/modal/cameraSettings.html', function(modal){
        $scope.modal = modal;
      },
      {
        scope: $scope
      });
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    $scope.setMode = function( mode ){
      $scope.mode = mode;
      socket.emit('remote:camera:mode', mode);
    }
  })
  .controller('BrowseCtrl', function($scope){
    $scope.color = '#000000';
    $scope.$on('event:color:change', function(e, hex){
      socket.emit('led:set:color', hex );
    });

    $scope.broadcastResetColor = function(){
      socket.emit('led:set:color', '#000000' );
      $scope.$broadcast('event:color:reset');
    };
    socket.on('event:arduino:data', function( data ) {
      console.log( 'Data: ' + data );
    });
  })
.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
