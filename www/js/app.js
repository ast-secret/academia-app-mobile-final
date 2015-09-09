// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var prod = false;

angular.module('starter', [
    'ionic',
    'starter.controllers',
    'starter.services',
    'angularMoment',
    'angular-storage',
    'ngCordova',
    'angular.filter',
    'angular-jwt'
])

// CONFIGURAÇÕES
.constant('CONFIG', {
    HTTP_TIMEOUT: 15000,
    WEBSERVICE_URL: (prod) ? 'http://api.asturia.kinghost.net' : 'http://localhost/academia-webservice',
    HOME: 'app/horarios',
    HOME_STATE: 'app.horarios',
    LOGOUT_REDIRECT: 'login',
    LOGOUT: 'login'
})

.run(function(
    $ionicPlatform,
    $cordovaNetwork,
    $rootScope,
    $state,
    CONFIG,
    store
) {
    // Garanto que rotas com requiresLogin = true não sejam acessados sem o JWT no localStore
    $rootScope.$on('$stateChangeStart', function(e, to){
        if (to.data && to.data.requiresLogin) {
            if (!store.get('jwt')) {
                $state.go(CONFIG.LOGOUT);
                e.preventDefault();
            }
        }
    });

    $rootScope.isOnline = true;
    
    $ionicPlatform.ready(function() {
        if (prod) {
            $rootScope.isOnline = $cordovaNetwork.isOnline();
            // listen for Online event
            $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
                $rootScope.isOnline = true;
            });
            $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
                $rootScope.isOnline = false;
            });
        }

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
.factory('myHttpInterceptor', function($q, CONFIG){
    return {
        request: function(config){
            config.timeout = CONFIG.HTTP_TIMEOUT;
            return config;
        }
    };
})

.config(function(
    $httpProvider,
    $stateProvider, 
    $urlRouterProvider,
    CONFIG,
    jwtInterceptorProvider
) {

    // Interceptor to send the JWT for every $http call.
    jwtInterceptorProvider.tokenGetter = function(store){
        return store.get('jwt');
    };

    $httpProvider.interceptors.push('jwtInterceptor');
    $httpProvider.interceptors.push('myHttpInterceptor');

    $stateProvider    
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })
    .state('home', {
        url: '/home',
        data: {
            requiresLog: false
        },
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
    })
    .state('login', {
        url: '/login',
        data: {
            requiresLog: false
        },
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
    })
    .state('esqueci-minha-senha', {
        url: '/esqueci-minha-senha',
        data: {
            requiresLog: false
        },
        templateUrl: 'templates/esqueci_minha_senha.html',
        controller: 'EsqueciMinhaSenhaController'
    })
    .state('logout', {
        url: '/logout',
        data: {
            requiresLog: false
        },
        templateUrl: 'templates/logout.html',
        controller: 'LogoutController'
    })

    .state('app.aulas', {
        url: '/aulas',
        data: {
            requiresLogin: true
        },
        views: {
            'menuContent': {
                templateUrl: 'templates/aulas.html',
                controller: 'AulasController'
            }
        }
    })
    .state('app.horarios', {
        url: '/horarios',
        data: {
            requiresLogin: true
        },
        views: {
            'menuContent': {
                templateUrl: 'templates/horarios.html',
                controller: 'HorariosController'
            }
        }
    })
    .state('app.comunicados', {
        url: '/comunicados',
        data: {
            requiresLogin: true
        },
        views: {
            'menuContent': {
                templateUrl: 'templates/comunicados.html',
                controller: 'ComunicadosController'
            }
        }
    })
    .state('app.comunicado', {
        url: '/comunicado/:comunicadoIndex',
        data: {
            requiresLogin: true
        },
        views: {
            'menuContent': {
                templateUrl: 'templates/comunicado.html',
                controller: 'ComunicadoController'
            }
        }
    })
    .state('app.ficha', {
        url: '/ficha',
        data: {
            requiresLogin: true
        },
        views: {
            'menuContent': {
                templateUrl: 'templates/ficha.html',
                controller: 'FichaController'
            }
        }
    })
    .state('app.configuracoes-de-conta', {
        url: '/configuracoes-de-conta',
        data: {
            requiresLogin: true
        },
        views: {
            'menuContent': {
                templateUrl: 'templates/configuracoes_de_conta.html',
                controller: 'ConfiguracoesDeContaController'
            }
        }
    })
    .state('app.alterar-senha', {
        url: '/alterar-senha',
        data: {
            requiresLogin: true
        },
        views: {
            'menuContent': {
                templateUrl: 'templates/alterar_senha.html',
                controller: 'AlterarSenhaController'
            }
        }
    })
    .state('app.caixa-de-sugestoes', {
        url: '/caixa-de-sugestoes',
        data: {
            requiresLogin: true
        },
        views: {
            'menuContent': {
                templateUrl: 'templates/caixa_de_sugestoes.html',
                controller: 'CaixaDeSugestoesController'
            }
        }
    });    

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise(CONFIG.HOME);
});
