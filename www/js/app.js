// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
    'ionic',
    'starter.controllers',
    'starter.services',
    'angularMoment',
    'angular-storage',
    'ngCordova',
    'angular.filter'
])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'LoginController'
            }
        }
    })

    .state('app.aulas', {
        url: '/aulas',
        views: {
            'menuContent': {
                templateUrl: 'templates/aulas.html',
                controller: 'AulasController'
            }
        }
    })
        .state('app.aula', {
            url: '/aula/:aulaId',
            views: {
                'menuContent': {
                    templateUrl: 'templates/aula.html',
                    controller: 'AulaController'
                }
            }
        })
    .state('app.horarios', {
        url: '/horarios/:weekdayIndex',
        views: {
            'menuContent': {
                templateUrl: 'templates/horarios.html',
                controller: 'HorariosController'
            }
        }
    })
    .state('app.comunicados', {
        url: '/comunicados',
        views: {
            'menuContent': {
                templateUrl: 'templates/comunicados.html',
                controller: 'ComunicadosController'
            }
        }
    })
    .state('app.comunicado', {
        url: '/comunicado/:comunicadoIndex',
        views: {
            'menuContent': {
                templateUrl: 'templates/comunicado.html',
                controller: 'ComunicadoController'
            }
        }
    })
    .state('app.ficha', {
        url: '/ficha',
        views: {
            'menuContent': {
                templateUrl: 'templates/ficha.html',
                controller: 'FichaController'
            }
        }
    })
    .state('app.configuracoes-de-conta', {
        url: '/configuracoes-de-conta',
        views: {
            'menuContent': {
                templateUrl: 'templates/configuracoes_de_conta.html',
                controller: 'ConfiguracoesDeContaController'
            }
        }
    })
    .state('app.alterar-senha', {
        url: '/alterar-senha',
        views: {
            'menuContent': {
                templateUrl: 'templates/alterar_senha.html',
                controller: 'AlterarSenhaController'
            }
        }
    })
    .state('app.sugestoes', {
        url: '/sugestoes',
        views: {
            'menuContent': {
                templateUrl: 'templates/sugestoes.html',
                controller: 'SugestoesController'
            }
        }
    });    

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/ficha');
});
