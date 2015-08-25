angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})
.filter('weekdayHumanize', function(Weekdays) {
    return function(input) {
        var names = Weekdays.get();
        return names[input];
    };
})

.controller('LoginController', function($scope) {

})
.controller('HorariosController', function($scope, $stateParams, Horarios, Weekdays) {
    $scope.weekdays = Weekdays.get();
    $scope.weekdayIndex = $stateParams.weekdayIndex;

    $scope.changeTab = function(index){
        $scope.weekdayIndex = index;
    };

    $scope.loading = true;
    $scope.horarios = Horarios.getLocalData();

    Horarios
        .getServerData()
        .then(function(data){
            $scope.horarios = data;
        })
        .finally(function(){
            $scope.loading = false;
        });

    $scope.doRefresh = function() {
        Horarios
            .getServerData()
            .then(function(data){
                $scope.horarios = data;
            })
            .finally(function(){
                $scope.$broadcast('scroll.refreshComplete');    
            });
    };
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
    $scope.aula = Aulas.get('id', $stateParams.aulaId);
    // angular.forEach($scope.aula, function(value, key){
    //     console.log(value);
    // });
})

.controller('FichaController', function($scope, $stateParams, Fichas) {
    $scope.loading = true;
    $scope.ficha = Fichas.getLocalData();

    $scope.exercisesColumns = Fichas.getExercisesColumns();

    $scope.currentTab = 0;

    $scope.changeTab = function(index){
        $scope.currentTab = index;
    };

    Fichas
        .getServerData()
        .then(function(data){
            $scope.ficha = data;
        })
        .finally(function(){
            $scope.loading = false;
        });

    $scope.doRefresh = function() {
        Fichas
            .Ficha()
            .then(function(data){
                $scope.ficha = data;
            })
            .finally(function(){
                $scope.$broadcast('scroll.refreshComplete');    
            });
    };
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