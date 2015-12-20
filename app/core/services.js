'use strict';
/* global LE, moment, io */

angular.module('sculptClient')

.factory('socket', function ($q, ENV, socketFactory) {

    var resource = {

        socket: socketFactory({
            ioSocket: io.connect(ENV.apiEndpoint)
        })
    };

    return {

        join: function (data) {

            return $q(function (resolve) {

                resource.socket.emit('join', data);
                resource.socket.once('join', function (response) {

                    resolve(response);
                });
            });
        },

        emit: function (event, data) {

            resource.socket.emit(event, data);
        },

        on: function (type, id, callback) {

            var key = type;
            resource.socket.removeListener(resource[type]);
            resource.socket.on(key, callback);
            resource[type] = key;
        }
    };
});
