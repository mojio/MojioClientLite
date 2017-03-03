/**
 * Created by Pooya Paridel on 2016-06-10.
 */

(function() {

    var $http = function(url) {
        var _encode = function(data) {
            var payload = '';
            if (typeof data === 'string') {
                payload = data;
            } else {
                var params = [];
                for (var k in data) {
                    if (data.hasOwnProperty(k)) {
                        params.push(encodeURIComponent(k) + '=' + encodeURIComponent(data[k]));
                    }
                }
                payload = params.join('&');
            }
            return payload;
        };
        var core = {
            ajax: function(method, url, data, headers) {
                return new Promise(function(resolve, reject) {
                    var xhr;
                    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
                        xhr = require("xmlhttprequest").XMLHttpRequest;
                    }
                    else {
                        xhr=XMLHttpRequest
                    }

                    var client = new xhr;
                    data = data || {};
                    headers = headers || {};
                    var payload = _encode(data);
                    if (method === 'GET' && payload) {
                        url += '?' + payload;
                        payload = null;
                    }
                    client.open(method, url);
                    var content_type = 'application/x-www-form-urlencoded';
                    for (var h in headers) {
                        if (headers.hasOwnProperty(h)) {
                            if (h.toLowerCase() === 'content-type') {
                                content_type = headers[h];
                            } else {
                                client.setRequestHeader(h, headers[h]);
                            }
                        }
                    }
                    client.setRequestHeader('Content-Type', content_type);
                    if (content_type === 'application/json') {
                        payload = JSON.stringify(data);
                    } else if (content_type === 'multipart/form-data') {
                        payload = data;
                    }
                    client.send(payload);
                    client.onload = function() {
                        if (this.status >= 200 && this.status < 300) {
                            resolve(this.responseText);
                        } else {
                            err=this.statusText;
                            if(err==null || err.length==0)
                                err=this.responseText
                            reject(err);
                        }
                    };
                    client.onerror = function() {
                        err=this.statusText;
                        if(err==null || err.length==0)
                            err=this.responseText
                        reject(err);
                    };
                });
            }
        };
        return {
            'get': function(args, headers) {
                return core.ajax('GET', url, args, headers);
            },
            'post': function(args, headers) {
                return core.ajax('POST', url, args, headers);
            },
            'put': function(args, headers) {
                return core.ajax('PUT', url, args, headers);
            },
            'delete': function(args, headers) {
                return core.ajax('DELETE', url, args, headers);
            }
        };
    };

    var extend = function(target) {
        var sources;
        sources = [].slice.call(arguments, 1);
        sources.forEach(function(source) {
            var prop;
            for (prop in source) {
                target[prop] = source[prop];
            }
        });
        return target;
    };

    var ACCESSTOKENSTORAGE='ACCESSTOKEN';

    var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

    var pathConcat= function (basePath,actualPath){

        if(actualPath.indexOf('http://')===0 || actualPath.indexOf('https://')===0)
        {
            return actualPath;
        }
        else
        {
            var sep='';
            if( basePath.charAt(basePath.length - 1)!=="/"  && actualPath.charAt(0)!=="/")
            {
                sep='/';
            }

            return basePath + sep + actualPath;
        }
    }

    var MojioClientLite = (function() {
        function MojioClientLite(conf) {

            this.authorize = bind(this.authorize, this);
            this.logout = bind(this.logout, this);
            this.token = bind(this.token, this);
            this.header = bind(this.header, this);
            this.query = bind(this.query, this);
            this.getPath = bind(this.getPath, this);
            this.get = bind(this.get, this);
            this.push = bind(this.push, this);
            this.put = bind(this.put, this);
            this.post = bind(this.post, this);
            this.delete = bind(this.delete, this);
            this.permissions = bind(this.permissions, this);
            this.image = bind(this.image, this);
            this.tags = bind(this.tags, this);
            this.app = bind(this.app, this);
            this.vehicle = bind(this.vehicle, this);
            this.user = bind(this.user, this);
            this.geofence = bind(this.geofence, this);
            this.group = bind(this.group, this);
            this.trip = bind(this.trip, this);
            this.mojio = bind(this.mojio, this);
            this.refreshToken = bind(this.refreshToken, this);

            var defConfig = {
                environment: '',
                accountsURL: 'accounts.moj.io',
                apiURL: 'api.moj.io',
                pushURL: 'push.moj.io',
                wsURL: 'api.moj.io',
                redirect_uri: (typeof window!=="undefined")?window.location.href.replace('http:', 'https:').split('#')[0]:'',
                scope: 'admin',
                acceptLanguage: 'en',
                dataStorage:{},
                tokenRequester: function() {
                    return document.location.hash.match(/access_token=([0-9a-f-]{36})/)[1];
                },
            };
            var env = 'https://';
            var wsEnv = 'wss://';
            this.config = extend({}, defConfig, conf);
            if (this.config.environment !== '') {
                env = env + this.config.environment + '-';
                wsEnv = wsEnv + this.config.environment + '-';
            }
            this.config.accountsURL = env + this.config.accountsURL;
            this.config.apiURL = env + this.config.apiURL;
            this.config.pushURL = env + this.config.pushURL;
            this.config.wsURL = wsEnv + this.config.wsURL;

            return
        }

        MojioClientLite.prototype.authorize = function(user,password) {
            if(typeof(user)!="undefined")
            {
                var _this=this;

                header={'Content-Type': 'x-www-form-urlencoded'};
                data={
                    userName : user,
                    password: password,
                    grant_type: 'password',
                    client_id: _this.config.application,
                    client_secret: _this.config.secret
                }

                return new Promise(function(resolve, reject) {
                    return $http(pathConcat(_this.config.accountsURL,'/oauth2/token')).post(data, extend({}, _this.header(), header)).then(function(data) {
                        res=JSON.parse(data);
                        _this.config.access_token=res.access_token;
                        _this.config.refresh_token=res.refresh_token;

                        return resolve(res);
                    }, function(data) {
                        return reject(data);
                    });
                });

            }
            else {
                if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
                    console.log("For anything other that browser please use authorize(user,password)");
                    return;
                }

                window.location.href=this.config.accountsURL + '/OAuth2/authorize?' +
                    'response_type=token&client_id=' + this.config.application +
                    '&redirect_uri=' + this.config.redirect_uri +
                    '&scope=' + this.config.scope;
            }
            return
        };

        MojioClientLite.prototype.logout = function() {
            if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
                console.log("This method is only for client side (in browser).");
                return;
            }

            window.location.href=this.config.accountsURL + '/OAuth2/authorize?' +
                'response_type=token&prompt=login&client_id=' + this.config.application +
                '&redirect_uri=' + this.config.redirect_uri +
                '&scope=' + this.config.scope;
        };

        MojioClientLite.prototype.refreshToken = function() {
            var _this=this;

            header={'Content-Type': 'x-www-form-urlencoded'};
            data={
                refresh_token : _this.config.refresh_token,
                grant_type: 'refresh_token',
                client_id: _this.config.application,
                client_secret: _this.config.secret
            }

            return new Promise(function(resolve, reject) {
                return $http(pathConcat(_this.config.accountsURL,'/oauth2/token')).post(data, extend({}, _this.header(), header)).then(function(data) {
                    res=JSON.parse(data);

                    _this.config.access_token=res.access_token;
                    _this.config.refresh_token=res.refresh_token;

                    return resolve(res);
                }, function(data) {
                    return reject(data);
                });
            });
        };

        MojioClientLite.prototype.token = function() {
            var param = window.location.toString().split('#')[1];
            var found = false;
            if (typeof param !== 'undefined' && param.indexOf('access_token=') !== -1) {
                try {
                    var access_token = this.config.tokenRequester();
                    if (access_token) {
                        this.config.access_token = access_token;
                        this.config.dataStorage[ACCESSTOKENSTORAGE]=this.config.access_token;
                        found = true;
                    }
                } catch (error) {
                    found = false;
                }
            } else {
                var temp = this.config.dataStorage[ACCESSTOKENSTORAGE];
                if (typeof(temp)!="undefined" && temp != null && temp !== null && temp.length !== 0) {
                    this.config.access_token = temp;
                    found = true;
                }
            }
            return found;
        };

        MojioClientLite.prototype.header = function() {
            return {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + this.config.access_token,
                'Accept-Language': this.config.acceptLanguage,
                'Content-Type': 'application/json'
            }
        };

        MojioClientLite.prototype.query = function() {
            var qc = (function() {
                function qc() {
                    this.prepare = bind(this.prepare, this);
                    this.orderby = bind(this.orderby, this);
                    this.select = bind(this.select, this);
                    this.filter = bind(this.filter, this);
                    this.skip = bind(this.skip, this);
                    this.top = bind(this.top, this);

                    this.data={};

                    return
                }

                qc.prototype.top = function(top) {
                    this.data.top = top;
                    return this;
                };

                qc.prototype.skip = function(skip) {
                    this.data.skip = skip;
                    return this;
                };

                qc.prototype.filter = function(filter) {
                    this.data.filter = filter;
                    return this;
                };

                qc.prototype.select = function(select) {
                    this.data.select = select;
                    return this;
                };

                qc.prototype.orderby = function(orderby) {
                    this.data.orderby = orderby;
                    return this;
                };

                qc.prototype.prepare = function() {
                    return this.data;
                };

                return qc;

            })();
            return new qc();
        };

        MojioClientLite.prototype.getPath = function(path, data, header) {
            var _this=this;

            data = data || {};
            if (data.prepare != null) {
                data = data.prepare();
            }
            return new Promise(function(resolve, reject) {
                return $http(pathConcat(_this.config.apiURL,path)).get(data, extend({}, _this.header(), header || {})).then(function(data) {
                    return resolve(JSON.parse(data));
                }, function(data) {
                    return reject(data);
                });
            });
        };

        MojioClientLite.prototype.get = function() {
            var _this=this;

            if (arguments.length === 0) {
                return {
                    me: function(data, header) {return _this.getPath('/v2/me', data, header);},
                    users: function(data, header) {return _this.getPath('/v2/users', data, header)},
                    mojios: function(data, header) {return _this.getPath('/v2/mojios', data, header)},
                    vehicles: function(data, header) {return _this.getPath('/v2/vehicles', data, header)},
                    apps: function(data, header) {return _this.getPath('/v2/apps', data, header)},
                    groups: function(data, header) {return _this.getPath('/v2/groups', data, header)},
                    trips: function(data, header) {return _this.getPath('/v2/trips', data, header)},
                    geofences: function(data, header) {return _this.getPath('/v2/geofences', data, header)},
                    user: function(id) {return _this.getPath('/v2/users/' + id)},
                    mojio: function(id) {return _this.getPath('/v2/mojios/' + id)},
                    vehicle: function(id) {return _this.getPath('/v2/vehicles/' + id)},
                    app: function(id) {return _this.getPath('/v2/apps/' + id)},
                    group: function(id) {return _this.getPath('/v2/groups/' + id)},
                    trip: function(id) {return _this.getPath('/v2/trips/' + id)},
                    geofence: function(id) {return _this.getPath('/v2/geofences/' + id)}
                }
            } else {
                return this.getPath(arguments[0], arguments[1] || {});
            }
        };

        MojioClientLite.prototype.push = function() {
            var _this=this;

            if (arguments.length === 0) {
                return {
                    mojios: function() {return _this.push('/v2/mojios')},
                    vehicles: function() {return _this.push('/v2/vehicles')},
                    mojio: function(obj) {return _this.push('/v2/mojios/' + obj.Id)},
                    vehicle: function(obj) {return _this.push('/v2/vehicles/' + obj.Id)}
                };
            } else {
                var ws;
                if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
                    var WebSocket = require('ws');
                    ws = new WebSocket(this.config.wsURL + arguments[0], this.config.access_token);
                }
                else {
                    ws = new WebSocket(this.config.wsURL + arguments[0], this.config.access_token);
                }

                return ws;
            }
        };

        MojioClientLite.prototype.put = function(path, data,header) {
            var _this=this;

            return new Promise(function(resolve, reject) {
                return $http(pathConcat(_this.config.apiURL,path)).put(data || {}, extend({}, _this.header(), header || {})).then(function(data) {
                    return resolve(JSON.parse(data));
                }, function(data) {
                    return reject(data);
                });
            });
        };

        MojioClientLite.prototype.post = function(path, data,header) {
            var _this=this;

            return new Promise(function(resolve, reject) {
                return $http(pathConcat(_this.config.apiURL,path)).post(data || {}, extend({}, _this.header(), header || {})).then(function(data) {
                    return resolve(JSON.parse(data));
                }, function(data) {
                    return reject(data);
                });
            });
        };

        MojioClientLite.prototype.delete = function(path, data,header) {
            var _this=this;

            return new Promise(function(resolve, reject) {
                return $http(pathConcat(_this.config.apiURL,path))["delete"](data || {}, extend({}, _this.header(), header || {})).then(function(data) {
                    return resolve(JSON.parse(data));
                }, function(data) {
                    return reject(data);
                });
            });
        };

        MojioClientLite.prototype.permissions = function(path, oid) {
            var _this=this;

            return {
                get: function() {return _this.getPath(path + '/' + oid + '/permissions')},
                delete: function() {return _this.delete(path + '/' + oid + '/permissions')},
                put: function(data) {return _this.put(path + '/' + oid + '/permissions', data)},
                post: function(data) {return _this.post(path + '/' + oid + '/permissions', data)}
            };
        };

        MojioClientLite.prototype.image = function(path, oid) {
            var _this=this;

            return {
                get: function() {return _this.getPath(path + '/' + oid + '/image')},
                delete: function() {return _this.delete(path + '/' + oid + '/image')},
                put: function(data) {return _this.put(path + '/' + oid + '/image', data, {'Content-Type': 'multipart/form-data'})},
                post: function(data) {return _this.post(path + '/' + oid + '/image', data, {'Content-Type': 'multipart/form-data'})}
            };
        };

        MojioClientLite.prototype.tags = function(path, oid) {
            var _this=this;

            return {
                delete: function(tag) {return _this.delete(path + '/' + oid + '/tags/' + tag)},
                post: function(tag) {return _this.post(path + '/' + oid + '/tags/' + tag)}
            };
        };

        MojioClientLite.prototype.app = function(obj) {
            var _this=this;

            return {
                put: function() {return _this.put('/v2/apps/' + obj.Id, obj)},
                post: function() {return _this.post('/v2/apps', obj)},
                delete: function() {return _this.delete('/v2/apps/' + obj.Id)},
                secret: function() {
                    return {
                        get: function() {return _this.getPath('/v2/apps/' + obj.Id + '/secret')},
                        delete: function() {return _this.delete('/v2/apps/' + obj.Id + '/secret')}
                    }
                },
                image: function() {return _this.image('/v2/apps', obj.Id)},
                permission: function() {return _this.getPath('/v2/apps/' + obj.Id + '/permission')},
                permissions: function() {return _this.permissions('/v2/apps', obj.Id)},
                tags: function() {return _this.tags('/v2/apps', obj.Id)}
            };
        };

        MojioClientLite.prototype.vehicle = function(obj) {
            var _this=this;

            return {
                put: function() {return _this.put('/v2/vehicles/' + obj.Id, obj)},
                post: function() {return _this.post('/v2/vehicles', obj)},
                delete: function() {return _this.delete('/v2/vehicles/' + obj.Id)},
                address: function() {return _this.getPath('/v2/vehicles/' + obj.Id + '/address')},
                trips: function(data) {return _this.getPath('/v2/vehicles/' + obj.Id + '/trips', data)},
                vin: function() {return _this.getPath('/v2/vehicles/' + obj.Id + '/vin')},
                serviceschedule: function() {return _this.getPath('/v2/vehicles/' + obj.Id + '/serviceschedule')},
                serviceschedulenext: function() {return _this.getPath('/v2/vehicles/' + obj.Id + '/serviceschedulenext')},
                history: function() {
                    return {
                        states: function() {return _this.getPath('/v2/vehicles/' + obj.Id + '/history/states')},
                        locations: function() {return _this.getPath('/v2/vehicles/' + obj.Id + '/history/locations')}
                    };
                },
                image: function() {return _this.image('/v2/vehicles', obj.Id)},
                permission: function() {return _this.getPath('/v2/vehicles/' + obj.Id + '/permission')},
                permissions: function() {return _this.permissions('/v2/vehicles', obj.Id)},
                tags: function() {return _this.tags('/v2/vehicles', obj.Id)}
            };
        };

        MojioClientLite.prototype.user = function(obj) {
            var _this=this;

            return {
                put: function() {return _this.put('/v2/users/' + obj.Id, obj)},
                post: function() {return _this.post('/v2/users', obj)},
                delete: function() {return _this.delete('/v2/users/' + obj.Id)},
                vehicles: function() {return _this.getPath('/v2/users/' + obj.Id + '/vehicles')},
                mojios: function() {return _this.getPath('/v2/users/' + obj.Id + '/mojios')},
                trips: function() {return _this.getPath('/v2/users/' + obj.Id + '/trips')},
                groups: function() {return _this.getPath('/v2/users/' + obj.Id + '/groups')},
                image: function() {return _this.image('/v2/users', obj.Id)},
                permission: function() {return _this.getPath('/v2/users/' + obj.Id + '/permission')},
                permissions: function() {return _this.permissions('/v2/users', obj.Id)},
                tags: function() {return _this.tags('/v2/users', obj.Id)}
            };
        };

        MojioClientLite.prototype.geofence = function(obj) {
            var _this=this;

            return {
                put: function() {return _this.put('/v2/geofences/' + obj.Id, obj)},
                post: function() {return _this.post('/v2/geofences', obj)},
                delete: function() {return _this.delete('/v2/geofences/' + obj.Id)}
            };
        };

        MojioClientLite.prototype.group = function(obj) {
            var _this=this;

            return {
                put: function() {return _this.put('/v2/groups/' + obj.Id, obj)},
                post: function() {return _this.post('/v2/groups', obj)},
                delete: function() {return _this.delete('/v2/groups/' + obj.Id)},
                users: function() {
                    return {
                        get: function() {return _this.getPath('/v2/groups/' + obj.Id + '/users')},
                        delete: function() {return _this.delete('/v2/groups/' + obj.Id + '/users')},
                        put: function(data) {return _this.put('/v2/groups/' + obj.Id + '/users', data)},
                        post: function(data) {return _this.post('/v2/groups/' + obj.Id + '/users', data)}
                    };
                },
                permission: function() {return _this.getPath('/v2/groups/' + obj.Id + '/permission')},
                permissions: function() {return _this.permissions('/v2/groups', obj.Id)},
                tags: function() {return _this.tags('/v2/groups', obj.Id)}
            };
        };

        MojioClientLite.prototype.trip = function(obj) {
            var _this=this;

            return {
                put: function() {return _this.put('/v2/trips/' + obj.Id, obj)},
                delete: function() {return _this.delete('/v2/trips/' + obj.Id)},
                history: function() {
                    return {
                        states: function() {return _this.getPath('/v2/trips/' + obj.Id + '/history/states')},
                        locations: function() {return _this.getPath('/v2/trips/' + obj.Id + '/history/locations')}
                    }
                },
                permission: function() {return _this.getPath('/v2/trips/' + obj.Id + '/permission')},
                permissions: function() {return _this.permissions('/v2/trips', obj.Id)},
                tags: function() {return _this.tags('/v2/trips', obj.Id)}
            };
        };

        MojioClientLite.prototype.mojio = function(obj) {
            var _this=this;

            return {
                put: function() {return _this.put('/v2/mojios' + '/' + obj.Id, obj)},
                post: function() {return _this.post('/v2/mojios', obj)},
                delete: function() {return _this.delete('/v2/mojios' + '/' + obj.Id)},
                permission: function() {return _this.getPath('/v2/mojios' + '/' + obj.Id + '/permission')},
                permissions: function() {return _this.permissions('/v2/mojios', obj.Id)},
                tags: function() {return _this.tags('/v2/mojios', obj.Id)}
            };
        };

        return MojioClientLite;

    })();


    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = MojioClientLite;
    }
    else {
        if (typeof define === 'function' && define.amd) {
            define([], function() {
                return MojioClientLite;
            });
        }
        else {
            window.MojioClientLite = MojioClientLite;
        }
    }

})();