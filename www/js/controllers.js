angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('LoginController', function($scope) {

})

.controller('ComunicadosController', function(
    $scope,
    Comunicados
) {

    $scope.loading = true;
    $scope.comunicados = Comunicados.getLocalData();

    Comunicados
        .getServerData()
        .then(function(data){
            $scope.comunicados = data;
        })
        .finally(function(){
            $scope.loading = false;
        });

    $scope.doRefresh = function() {
        Comunicados
            .getServerData()
            .then(function(data){
                $scope.comunicados = data;
            })
            .finally(function(){
                $scope.$broadcast('scroll.refreshComplete');    
            });
    };
})
.controller('SugestoesController', function($scope, $ionicLoading, Sugestoes) {
    $scope.sugestao = {};

    $scope.send = function(sugestao){
        $ionicLoading.show({
            template: 'Enviando, aguarde...'
        });
        Sugestoes
            .send(sugestao)
            .then(function(){
                $scope.sugestao = {};
            })
            .finally(function(){
                $ionicLoading.hide();
            });
    };
})
.controller('ComunicadoController', function($scope, $stateParams, Comunicados) {
    $scope.comunicado = Comunicados.getLocalData()[$stateParams.comunicadoIndex];
});