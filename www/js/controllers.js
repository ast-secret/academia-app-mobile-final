angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, store) {
    $scope.$on( "$ionicView.beforeEnter", function(scopes, states) {
        $scope.menuIcons = {
            comunicados: 'ion-flag',
            aulas: 'ion-arrow-graph-up-right',
            ficha: 'ion-clipboard',
            horarios: 'ion-android-time',
        };
        $scope.user = store.get('User');    
    });
})
.filter('weekdayHumanize', function(Weekdays) {
    return function(input) {
        var names = Weekdays.get();
        return names[input];
    };
})
.directive('itemListAula', function(){
    return {
        templateUrl:  'templates/Element/item_list_aula.html',
        scope: {
            'aula': '=content'
        }
    };
})
.directive('myNetworkAlert', function(){
    return {
        templateUrl:  'templates/Element/network_alert.html',
    };
})
.controller('HomeController', function(
    $scope,
    $ionicModal,
    $ionicLoading,
    $state,
    User
) {
    $scope.$on( "$ionicView.beforeEnter", function(scopes, states) {
        $scope.form = {};
        $scope.wrongCredentials = false;
    });

    $ionicModal.fromTemplateUrl('templates/Modal/login.html', {
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

    $scope.doLogin = function(){
        $ionicLoading.show({template: 'Entrando, aguarde...'});
        User
            .login($scope.form)
            .then(function(home){
                $scope.closeModal();
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
.controller('LogoutController', function(
    $ionicLoading,
    $scope,
    $rootScope,
    $state,
    $timeout,
    CONFIG,
    $window
) {
    var duration = 1000;
    $scope.$on( "$ionicView.beforeEnter", function(scopes, states) {
        $ionicLoading.show({template: 'Saindo, aguarde...'});
        
        $window.localStorage.clear();

        $timeout(function(){
            $ionicLoading.hide();
            $state.go(CONFIG.LOGOUT_REDIRECT);
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
    $state,
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
    $scope.weekdayIndex = 0;

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
.controller('AlterarSenhaController', function(
    $scope,
    $ionicLoading,
    User
) {
    $scope.form = {};
    $scope.formError = null;

    $scope.doSubmit = function(){
        $ionicLoading.show({template: 'Alterando senha, aguarde...'});
        console.log($scope.form);
        User
            .changePassword($scope.form)
            .then(function(result){
                $scope.form = {};
            }, function(err){
                $scope.formError = err;
            })
            .finally(function(){
                $ionicLoading.hide();
            });
    };
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