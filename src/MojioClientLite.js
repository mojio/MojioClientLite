/**
 * Created by pooyaparidel on 2016-06-10.
 */

(function() {

    var bind = function(fn, me){ return function(){ return fn.apply(me, arguments)}};

    var MojioClientLite = (function() {
        function MojioClientLite(conf) {
            this.authorize = bind(this.authorize, this);
            this.config = 0;
        }

        MojioClientLite.prototype.authorize = function() {
            this.config++;
            return console.log(this.config);
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