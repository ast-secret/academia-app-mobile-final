angular.module('starter.services', [])

.factory('DadosGerais', function($q){
    var data = {
        institucional: {
            name: 'Spartan',
            funcionamento: 'Segunda e sexta de 07 às 22',
            endereco: 'Rua 223, N 92',
            contatos: [
                {
                    icon: 'iphone',
                    name: '(24) 93123189372',
                },
                {
                    icon: 'ios-email',
                    name: 'atendimento@spartan.com.br'
                }
            ],
            redesSociais: [
                {
                    icon: 'social-facebook',
                    name: 'Facebook',
                    url: 'https://facebook.com/spartan'
                },
                {
                    icon: 'social-twitter',
                    name: 'Twitter',
                    url: 'https://twitter.com/spartan'
                }
            ]
        }
    };
    return {
        getInstitucional: function() {
            var defer = $q.defer();
            defer.resolve(data.institucional);
            return defer.promise;
        }
    };
})

.factory('Notification', function(
    $q,
    $http,
    $ionicPlatform,
    $rootScope,
    $cordovaDevice,
    CONFIG,
    store
){
    return {
        register: function(){

            var defer = $q.defer();
            var _this = this;

            if (ionic.Platform.isIOS() && prod) {
                _this
                    .registerIos()
                    .then(function(){
                        defer.resolve();
                    }, function(){
                        defer.reject();
                    });
            } else {
                _this
                    .registerAndroid()
                    .then(function(regId){
                        var registeredBefore = store.get('regIdRegistered') || false;
                        console.log('Valor do registered Before');
                        console.log(registeredBefore);
                        if (!registeredBefore) {

                            var uuid = (prod) ? $cordovaDevice.getUUID() : '123';
                            var platform = (prod) ? $cordovaDevice.getPlatform() : 'android';

                            console.log(regId);
                            console.log(uuid);

                            console.log('Salvando');
                            _this
                                .saveRegId(uuid, regId, platform)
                                .then(function(){
                                    defer.resolve();
                                }, function (){
                                    console.log('deu ruim para salvar');
                                    defer.reject();
                                });
                        }
                    }, function(){
                        defer.reject();
                    });
            }
            return defer.promise;
        },
        saveRegId: function(uuid, regId, platform){

            var defer = $q.defer();
            console.log('Indo no servidor salvar o regid');
            $http
                .post(CONFIG.WEBSERVICE_URL + '/regid/add.json', {
                    gym_id: CONFIG.GYM_ID,
                    device_uuid: uuid,
                    device_regid: regId,
                    platform: platform
                })
                .then(function(result){
                    
                    console.log('FOi no servidor e voltou jóia');
                    /**
                     * importante pois pode retornar 200 por algum motivo mas nao
                     * ter salvo, ai falariamos para o app que salvou e ele nao salvaria nunca
                     * sendo assim o app nunca receberia notificação.
                     * o retorno pixuleco garante que salvou 
                     */
                    if (result.data.message.message == 'pixuleco') {
                        store.set('regIdRegistered', true);
                    }
                    defer.resolve();
                }, function(){
                    console.log('FOi no servidor e voltou reuim, deu erro rsrsrs');
                    defer.reject();
                });

            return defer.promise;
        },
        registerAndroid: function(){
            var defer = $q.defer();

            if (!prod) {
                defer.resolve('123regid');
                return defer.promise;
            }

            ionic.Platform.ready(function(){
                var push = PushNotification.init({
                    "android": {
                        "senderID": CONFIG.GCM_SENDER_ID,
                        "icon": "www/img/push_notification_icon.png"
                    },
                    "ios": {
                        "alert": "true",
                        "badge": "true",
                        "sound": "true"
                    }
                });
                push.on('registration', function(data) {
                    console.log('Registrado');
                    console.log(data.registrationId);
                    defer.resolve(data.registrationId);
                });
                push.on('error', function(e) {
                    console.log('deu erro no registro');
                    console.log(e.message);
                    defer.reject();
                });

            });
            return defer.promise;
        },
        registerIos: function(){

        },
    };
})


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
        authRequire: function() {
            var defer = $q.defer();
            if (store.get('jwt')) {
                console.log(store.get('jwt'));
                console.log(store.get('user'));
                console.log('De boas');
                defer.resolve();
            } else {
                console.log('rejeitado');
                defer.reject('AUTH_REQUIRED');
            }
            return defer.promise;
        },
        authData: function() {
            var defer = $q.defer();
            defer.resolve(store.get('user') || null);
            return defer.promise;
        },
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
            // Garanto que ele faça login na academia dona do app
            // Deve ser passado por get pois ele pega no initialize do appController
            // e se passar por post ali ele ainda não formou o request->data...
            var gymId = CONFIG.GYM_ID;

            this.getPushRegistrationId()
                .then(function(regId){

                    postData.push_reg_id = regId;
                    postData.platform = (prod) ? ionic.Platform.platform() : 'android';

                    $http({
                        url: CONFIG.WEBSERVICE_URL + '/auth/token/create.json?gym_id=' + gymId,
                        method: 'POST',
                        data: postData,
                        skipAuthorization: true
                    })
                    .then(function(result){
                        store.set('jwt', result.data.message.token || null);
                        store.set('user', result.data.message.user);
                        /**
                         * Obrigo ele a registrar o regid novamente mas agora ele
                         * tera o ID do usuario logado no telefone.
                         */
                        store.set('regIdRegistered', false);
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
            defer.resolve('123');
            return defer.promise;

            if (!prod) {
                defer.resolve('login_browser_dont_have_regid');
            }

            var androidConfig = {
                "senderID": CONFIG.GOOGLE_SENDER_ID,
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
                .get(CONFIG.WEBSERVICE_URL + '/times.json?gym_id=' + CONFIG.GYM_ID)
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
                .get(CONFIG.WEBSERVICE_URL + '/services.json?gym_id=' + CONFIG.GYM_ID)
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
                .get(CONFIG.WEBSERVICE_URL + '/releases.json?gym_id=' + CONFIG.GYM_ID)
                .success(function(result){
                    // console.log(result.releasesByDestaque[1]);
                    var releases = result.releasesByDestaque;
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
