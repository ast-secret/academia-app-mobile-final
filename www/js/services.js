angular.module('starter.services', [])

.constant('WEBSERVICE_URL', 'http://localhost/academia-webservice')

.factory('Comunicados', function(
    $q, 
    $timeout, 
    $http, 
    localStorageService,
    WEBSERVICE_URL
){
    return {
        getLocalData: function(){
            return localStorageService.get('comunicados');
        },
        getServerData: function(){
            var _this = this;
            var defer = $q.defer();
            
            $http
                .get(WEBSERVICE_URL + '/releases.json')
                .success(function(result){
                    var releases = result.releases;
                    localStorageService.set('comunicados', releases);
                    defer.resolve(releases);
                })
                .error(function(){
                  defer.reject();  
                });

            return defer.promise;
        }
    };
})
.factory('Sugestoes', function($q, $timeout){
    return {
        send: function(sugestao){
            var defer = $q.defer();
            
            $timeout(function(){
                defer.resolve();
            }, 2000);

            return defer.promise;
        }
    };
});