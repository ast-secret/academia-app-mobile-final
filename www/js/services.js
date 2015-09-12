angular.module('starter.services', [])

.factory('Util', function(){
    return {
        get: function(data, key, value){
            var out = null;
            angular.forEach(data, function(val, index){
                if (val[key] == value) {
                    out = val;
                    return true;
                }
            });
            return out;
        }
    };
})
.factory('Weekdays', function(){
    return {
        data: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'],
        get: function(){
            return this.data;
        }
    };
})
.factory('User', function(
    $cordovaPush,
    $rootScope,
    $q,
    $cordovaToast,
    $http,
    store,
    $cordovaDialogs,
    CONFIG
){
    return {
        changePassword: function(data){
            console.log(data);
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: CONFIG.WEBSERVICE_URL + '/customers/change-password.json',
                data: data
            })
            .then(function(result){
                defer.resolve(result);
                $cordovaToast.show('Senha alterada com sucesso', 'long', 'bottom');
            }, function(err){
                $cordovaDialogs.alert(err.data.message, 'Confirmação incorreta');
                defer.reject(err.data.message);
            });

            return defer.promise;
        },
        login: function(postData){
            var defer = $q.defer();

            this.getPushRegistrationId()
                .then(function(regId){

                    postData.push_reg_id = regId;
                    postData.platform = (prod) ? ionic.Platform.platform() : 'android';

                    $http({
                        url: CONFIG.WEBSERVICE_URL + '/auth/token/create.json',
                        method: 'POST',
                        data: postData,
                        skipAuthorization: true
                    })
                    .then(function(result){
                        store.set('jwt', result.data.message.token || null);
                        store.set('User', result.data.message.user);
                        defer.resolve(CONFIG.HOME_STATE);
                    }, function(err){
                        defer.reject(err);
                    });
                }, function(){
                    defer.reject();
                });
            return defer.promise;
        },
        getPushRegistrationId: function(){
            var defer = $q.defer();

            if (!prod) {
                defer.resolve('login_browser_dont_have_regid');
                return defer.promise;
            }

            var androidConfig = {
                "senderID": "replace_with_sender_id",
            };

            document.addEventListener("deviceready", function(){
                $cordovaPush.register(androidConfig).then(function(result) {
                // Success
                }, function(err) {
                    defer.reject();
                });

                $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
                    switch (notification.event) {
                        case 'registered':
                            console.log(notification.regid);
                            defer.resolve(notification.regid);
                        break;
                    }
                });
            });
            return defer.promise;
        }
    };
})
.factory('Fichas', function(
    $q,
    $http,
    store,
    CONFIG
){
    return {
        getExercisesColumns: function(){
            return ['A', 'B', 'C', 'D', 'E', 'F'];
        },
        getLocalData: function(){
            return store.get('ficha') || null;
        },
        getServerData: function(){
            var _this = this;
            var defer = $q.defer();

            $http
                .get(CONFIG.WEBSERVICE_URL + '/cards.json')
                .success(function(result){
                    var ficha = result.card;
                    store.set('ficha', ficha);
                    defer.resolve(ficha);
                })
                .error(function(){
                  defer.reject();
                });

            return defer.promise;
        }
    };
})
.factory('Horarios', function(
    $q,
    $http,
    Aulas,
    store,
    CONFIG
){
    return {
        getLocalData: function(){
            return store.get('horarios') || [];
        },
        getServerData: function(){
            var _this = this;
            var defer = $q.defer();
            $http
                .get(CONFIG.WEBSERVICE_URL + '/times.json')
                .success(function(result){
                    // ATENÇÃO!! Eu também pego as aulas pq quando ele clica na moral
                    // eu trago a aula
                    var horarios = result.times;
                    Aulas
                        .getServerData()
                        .then(function(){
                            store.set('horarios', horarios);
                            defer.resolve(horarios);
                        }, function(){
                            defer.reject();
                        });
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
    Util,
    CONFIG
){
    return {
        get: function(key, value){
            // console.log(Util.get(this.getLocalData(), key, value));
            return Util.get(this.getLocalData(), key, value);
        },
        getLocalData: function(){
            return store.get('aulas');
        },
        getServerData: function(){
            var _this = this;
            var defer = $q.defer();

            $http
                .get(CONFIG.WEBSERVICE_URL + '/services.json')
                .success(function(result){
                    var services = result.services;
                    store.set('aulas', services);
                    defer.resolve(services);
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
    CONFIG
){
    return {
        getLocalData: function(){
            return store.get('comunicados');
        },
        getServerData: function(){
            var _this = this;
            var defer = $q.defer();

            $http
                .get(CONFIG.WEBSERVICE_URL + '/releases.json')
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
.factory('CaixaDeSugestoes', function(
    $cordovaToast,
    $http,
    $ionicPlatform,
    $q,
    CONFIG
){
    return {
        send: function(sugestao){
            var defer = $q.defer();

            var toastMsg = '';

            $http
                .post(CONFIG.WEBSERVICE_URL + '/suggestions/add.json', sugestao)
                .success(function(result){
                    toastMsg = 'Sugestão enviada, obrigado.';
                    defer.resolve(result);
                })
                .error(function(){
                    toastMsg = 'Sugestão não enviada. Por favor, aguarde um pouco e tente novamente.';
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
