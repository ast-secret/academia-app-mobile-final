angular.module('starter.services', [])

.constant('WEBSERVICE_URL', 'http://localhost/academia-webservice')
.factory('Weekdays', function(){
    return {
        data: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sabado'],
        get: function(){
            return this.data;
        }
    };
})
.factory('Horarios', function(
    $q, 
    $http, 
    store,
    WEBSERVICE_URL
){
    return {
        getLocalData: function(){
            return store.get('horarios') || [];
        },
        getServerData: function(){
            var _this = this;
            var defer = $q.defer();
            
            $http
                .get(WEBSERVICE_URL + '/times.json')
                .success(function(result){
                    var horarios = result.times;
                    store.set('horarios', horarios);
                    defer.resolve(horarios);
                })
                .error(function(){
                  defer.reject();  
                });

            return defer.promise;
        }
    };
})
.factory('Aulas', function(
    $q, 
    $http, 
    store,
    WEBSERVICE_URL
){
    return {
        getLocalData: function(){
            return store.get('aulas');
        },
        getServerData: function(){
            var _this = this;
            var defer = $q.defer();
            
            $http
                .get(WEBSERVICE_URL + '/services.json')
                .success(function(result){
                    var releases = result.releases;
                    store.set('aulas', releases);
                    defer.resolve(releases);
                })
                .error(function(){
                  defer.reject();  
                });

            return defer.promise;
        }
    };
})
.factory('Comunicados', function(
    $q, 
    $http, 
    store,
    WEBSERVICE_URL
){
    return {
        getLocalData: function(){
            return store.get('comunicados');
        },
        getServerData: function(){
            var _this = this;
            var defer = $q.defer();
            
            $http
                .get(WEBSERVICE_URL + '/releases.json')
                .success(function(result){
                    var releases = result.releases;
                    store.set('comunicados', releases);
                    defer.resolve(releases);
                })
                .error(function(){
                  defer.reject();  
                });

            return defer.promise;
        }
    };
})
.factory('Sugestoes', function(
    $cordovaToast,
    $http,
    $ionicPlatform,
    $q,
    WEBSERVICE_URL
){
    return {
        send: function(sugestao){
            var defer = $q.defer();
            
            var toastMsg = '';

            $http
                .post(WEBSERVICE_URL + '/suggestions/add.json', sugestao)
                .success(function(result){
                    toastMsg = 'A sua sugestão foi enviada com sucesso! Obrigado.';
                    defer.resolve(result);
                })
                .error(function(){
                    toastMsg = 'A sua sugestão não foi enviada, Por favor aguarde um pouco e tente novamente.';
                    defer.reject();  
                })
                .finally(function(){
                    $ionicPlatform.ready(function() {
                        $cordovaToast.show(toastMsg, 'long', 'bottom');
                    });
                });

            return defer.promise;
        }
    };
});