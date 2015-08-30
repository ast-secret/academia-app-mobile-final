angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, store) {
    $scope.$on( "$ionicView.beforeEnter", function(scopes, states) {
        $scope.user = store.get('User');    
    });
})
.filter('weekdayHumanize', function(Weekdays) {
    return function(input) {
        var names = Weekdays.get();
        return names[input];
    };
})
.directive('myNetworkAlert', function(){
    return {
        templateUrl:  'templates/Element/network_alert.html'
    };
})
.controller('LogoutController', function(
    $ionicLoading,
    $scope,
    $state,
    $timeout,
    $window
) {
    var duration = 1000;
    $scope.$on( "$ionicView.beforeEnter", function(scopes, states) {
        $ionicLoading.show({template: 'Saindo, aguarde...'});
        
        $window.localStorage.clear();
        $scope = null;

        $timeout(function(){
            $ionicLoading.hide();
            $state.go('login');
        }, duration);
    });
})
.controller('LoginController', function(
    $scope,
    $state,
    $ionicLoading,
    User
) {
    
    $scope.$on( "$ionicView.beforeEnter", function(scopes, states) {
        $scope.form = {};
        $scope.wrongCredentials = false;
    });

    $scope.doLogin = function(){
        $ionicLoading.show({template: 'Entrando, aguarde...'});
        User
            .login($scope.form)
            .then(function(home){
                $state.go(home);
            }, function(err){
                if (err.status == 401) {
                    $scope.wrongCredentials = true;
                }
            })
            .finally(function(){
                $ionicLoading.hide();
            });
    };
})
.controller('HorariosController', function($scope,
    $ionicModal,
    $stateParams,
    Aulas,
    Horarios, 
    Weekdays
) {
    $scope.$on( "$ionicView.beforeEnter", function(scopes, states) {
        $scope.horarios = Horarios.getLocalData();
        $scope.loading = !$scope.horarios;

        Horarios
            .getServerData()
            .then(function(data){
                $scope.horarios = data;
            })
            .finally(function(){
                $scope.loading = false;
            });
    });

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
        $scope.aula = Aulas.get('id', aula.id);
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };

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

    $scope.$on( "$ionicView.beforeEnter", function(scopes, states) {
        $scope.aulas = Aulas.getLocalData();
        $scope.loading = !$scope.aulas;
        $scope.aula = {};//Serve para a aula que vai aparecer no modal

        Aulas
            .getServerData()
            .then(function(data){
                console.log(data);
                $scope.aulas = data;
            })
            .finally(function(){
                $scope.loading = false;
            });

    });

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

.controller('FichaController', function(
    $scope,
    $stateParams,
    $ionicModal,
    Fichas
) {
    $scope.$on( "$ionicView.beforeEnter", function(scopes, states) {
        $scope.ficha = Fichas.getLocalData();
        $scope.loading = !$scope.ficha;

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
    $scope.$on( "$ionicView.beforeEnter", function(scopes, states) {
        $scope.comunicados = Comunicados.getLocalData();
        $scope.loading = !$scope.comunicados;

        Comunicados
            .getServerData()
            .then(function(data){
                $scope.comunicados = data;
            })
            .finally(function(){
                $scope.loading = false;
            });
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
.controller('ComunicadoController', function($scope, $stateParams, Comunicados) {
    $scope.comunicado = Comunicados.getLocalData()[$stateParams.comunicadoIndex];
})
.controller('CaixaDeSugestoesController', function(
    $ionicLoading, 
    $scope, 
    CaixaDeSugestoes
) {
    $scope.sugestao = {};

    $scope.send = function(sugestao){
        $ionicLoading.show({
            template: 'Enviando, aguarde...'
        });
        CaixaDeSugestoes
            .send(sugestao)
            .then(function(){
                $scope.sugestao = {};
            })
            .finally(function(){
                $ionicLoading.hide();
            });
    };
});