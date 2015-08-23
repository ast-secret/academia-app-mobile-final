angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})
.filter('weekdayHumanize', function() {
    return function(input) {
        var names = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sabado'];
        return names[input];
    };
})

.controller('LoginController', function($scope) {

})

.controller('AulasController', function($scope, Aulas) {
    $scope.loading = true;
    $scope.aulas = Aulas.getLocalData();

    Aulas
        .getServerData()
        .then(function(data){
            $scope.aulas = data;
        })
        .finally(function(){
            $scope.loading = false;
        });

    $scope.doRefresh = function() {
        Aulas
            .getServerData()
            .then(function(data){
                $scope.aulas = data;
            })
            .finally(function(){
                $scope.$broadcast('scroll.refreshComplete');    
            });
    };
})

.controller('AulaController', function($scope, $stateParams, Aulas) {
    $scope.aula = Aulas.getLocalData()[$stateParams.aulaIndex];
    // angular.forEach($scope.aula, function(value, key){
    //     console.log(value);
    // });
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