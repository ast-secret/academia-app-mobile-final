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
.directive('fillContentHeight', function($window){
    return {
        restrict: 'C',
        link: function(scope, element){
            function fillHeight() {
                console.log('filling');
                var windowH = $window.innerHeight;
                var content = document.getElementsByClassName('scroll-content');
                var scrollBar = document.getElementsByClassName('scroll-bar');
                console.log(scrollBar.length);
                if (scrollBar.length > 1) {
                  // content[0].removeChild(scrollBar[0]);
                }
                element[0].style.height = (windowH) + 'px';
            }
            fillHeight();
            $window.addEventListener("resize", fillHeight);

            // document.getElementsByClassName('scroll')[0].remove();
            ///document.getElementsByClassName('scroll-bar-v')[0].style.visibility = 'hidden';
        }
    };
})
.controller('HomeController', function(
    $scope,
    $ionicModal,
    $ionicLoading,
    $window
) {
    $window.localStorage.clear();
})
.controller('LogoutController', function(
    $ionicLoading,
    $scope,
    $rootScope,
    $state,
    CONFIG,
    $timeout,
    $window
) {

    var delay = 1500;
    $scope.$on( "$ionicView.beforeEnter", function(scopes, states) {
        $ionicLoading.show({template: 'Saindo, aguarde...'});

        $window.localStorage.clear();
    });
    $timeout(function(){
        $ionicLoading.hide();
        $state.go(CONFIG.LOGOUT_REDIRECT);
    }, delay);

})
.controller('EsqueciMinhaSenhaController', function(
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
            })
            .finally(function(){
                $ionicLoading.hide();
            });
    };
})
.controller('LoginController', function(
    $scope,
    $state,
    $ionicLoading,
    $cordovaDialogs,
    User,
    $window
) {

    $scope.$on( "$ionicView.beforeEnter", function(scopes, states) {
      console.log('Estou no login');
        $scope.form = {};
        $window.localStorage.clear();
    });

    $scope.doLogin = function(){
        $ionicLoading.show({template: 'Entrando, aguarde...'});
        User
            .login($scope.form)
            .then(function(home){
                $state.go(home);
            }, function(err){
                if (err.status == 401) {
                    $cordovaDialogs.alert('A combinação email/senha está incorreta. Por favor, tente novamente.', 'Combinação incorreta');
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
        console.log($scope.horarios);

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

.controller('AulaController', function(
  $scope,
  $stateParams,
  Aulas
) {
    $scope.aula = Aulas.get('id', $stateParams.aulaId);
})

.controller('ConfiguracoesDeContaController', function($scope) {

})
.controller('AlterarSenhaController', function(
    $scope,
    $ionicLoading,
    $cordovaDialogs,
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
    $cordovaDialogs,
    Fichas
) {
    $scope.$on( "$ionicView.beforeEnter", function(scopes, states) {
        $scope.ficha = Fichas.getLocalData();
        $scope.loading = !$scope.ficha;
        // Só puxa do server se não tiver nenhuma.. fiz isso diferente das outras
        // paginas pq aqui eh diferente soh de tempos em tempos que muda e tb
        // pq estava bugando as marcações das checkboxes
        if (!$scope.ficha) {
            Fichas
                .getServerData()
                .then(function(data){
                    $scope.ficha = data;
                })
                .finally(function(){
                    $scope.loading = false;
                });
        }
    });

    $scope.exercisesColumns = Fichas.getExercisesColumns();

    $scope.currentTab = 0;

    $scope.clearCheckboxes = function(){
        $cordovaDialogs.confirm(
            'Tem certeza que deseja limpar todas as seleções dos exercícios deste grupo?',
            'Limpar seleções',
            ['Limpar', 'Cancelar'])
            .then(function(buttonIndex) {
                // no button = 0, 'OK' = 1, 'Cancel' = 2
                if (buttonIndex == 1) {
                    angular.forEach($scope.ficha.exercises[$scope.currentTab], function(value){
                        value.checked = false;
                    });
                }
            });
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
                console.log(data[1]);
                $scope.comunicados = data;
            })
            .finally(function(){
                $scope.$broadcast('scroll.refreshComplete');
            });
    };
})
.controller('ComunicadoController', function($scope, $stateParams, Comunicados) {
    $scope.comunicado = Comunicados.getLocalData()[$stateParams.destaque][$stateParams.comunicadoIndex];
})
.controller('CaixaDeSugestoesController', function(
    $ionicLoading,
    $scope,
    $timeout,
    CaixaDeSugestoes
) {
    var delay = 1500;
    $scope.sugestao = {};

    $scope.send = function(sugestao){
        $ionicLoading.show({
            template: 'Enviando, aguarde...'
        });
        $timeout(function(){
            CaixaDeSugestoes
                .send(sugestao)
                .then(function(){
                    $scope.sugestao = {};
                })
                .finally(function(){
                    $ionicLoading.hide();
                });
        }, delay);
    };
});
