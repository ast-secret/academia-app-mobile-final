angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope, $cordovaNetwork) {


})
.filter('weekdayHumanize', function(Weekdays) {
    return function(input) {
        var names = Weekdays.get();
        return names[input];
    };
})
.directive('noDataAlert', function(){
    return {
        restrict: 'E',
        scope: {
            tey: '='
        },
        templateUrl:  'templates/Element/no_data_alert.html'
    };
})
.directive('myNetworkAlert', function(){
    return {
        templateUrl:  'templates/Element/network_alert.html'
    };
})
.controller('LoginController', function($scope) {

})
.controller('HorariosController', function($scope,
    $ionicModal,
    $stateParams,
    Aulas,
    Horarios, 
    Weekdays
) {
    $scope.weekdays = Weekdays.get();
    $scope.weekdayIndex = $stateParams.weekdayIndex;

    $scope.changeTab = function(index){
        $scope.weekdayIndex = index;
    };

    $ionicModal.fromTemplateUrl('templates/Modal/aula.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function(aula) {
        $scope.aula = aula;
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
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

.controller('AulasController', function($scope, $ionicModal, Aulas) {
    $scope.loading = true;
    $scope.aulas = Aulas.getLocalData();
    $scope.aula = {};//Serve para a aula que vai aparecer no modal

    $ionicModal.fromTemplateUrl('templates/Modal/aula.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function(aula) {
        $scope.aula = aula;
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    $scope.changeTab = function(index){
        $scope.currentTab = index;
    };

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

.controller('ConfiguracoesDeContaController', function($scope) {

})
.controller('AlterarSenhaController', function($scope) {

})

.controller('FichaController', function($scope, $stateParams, $ionicModal, Fichas) {
    
    $scope.$on( "$ionicView.beforeEnter", function(scopes, states) {
        $scope.loading = true;
        $scope.ficha = Fichas.getLocalData();

        Fichas
            .getServerData()
            .then(function(data){
                $scope.ficha = data;
            })
            .finally(function(){
                $scope.loading = false;
            });
    });

    $scope.exercisesColumns = Fichas.getExercisesColumns();

    $scope.currentTab = 0;

    $scope.isOverdue = function(date){
        return date < new Date().toISOString();
    };

    $ionicModal.fromTemplateUrl('templates/Modal/ficha_detalhes.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    $scope.changeTab = function(index){
        $scope.currentTab = index;
    };

    $scope.doRefresh = function() {
        Fichas
            .getServerData()
            .then(function(data){
                $scope.ficha = data;
            })
            .finally(function(){
                $scope.$broadcast('scroll.refreshComplete');    
            });
    };
    $scope.doRefreshByButton = function(){
        $scope.loading = true;
        Fichas
            .getServerData()
            .then(function(data){
                $scope.ficha = data;
            })
            .finally(function(){
                $scope.loading = false;
            });  
    };
})

.controller('ComunicadosController', function(
    $scope,
    Comunicados
) {

    $scope.jonas = {name: 'jonas'};
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