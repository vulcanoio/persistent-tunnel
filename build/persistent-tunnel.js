// Generated by CoffeeScript 1.10.0
(function() {
  var NodeAgent, TunnelingError, TypedError, http, net,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  net = require('net');

  http = require('http');

  NodeAgent = require('../vendor/_http_agent');

  TypedError = require('typed-error');

  module.exports.TunnelingError = TunnelingError = (function(superClass) {
    extend(TunnelingError, superClass);

    function TunnelingError() {
      return TunnelingError.__super__.constructor.apply(this, arguments);
    }

    return TunnelingError;

  })(TypedError);

  module.exports.Agent = NodeAgent.Agent;

  module.exports.createConnection = function(options, cb) {
    var connectOptions, onConnect, onError, proxyOptions, ref, ref1, ref2, req;
    proxyOptions = (ref = options.proxy) != null ? ref : {};
    connectOptions = {
      method: 'CONNECT',
      host: (ref1 = proxyOptions.host) != null ? ref1 : 'localhost',
      port: (ref2 = proxyOptions.port) != null ? ref2 : 3128,
      path: options.host + ":" + options.port,
      agent: false
    };
    onError = function(err, res) {
      var cause, error, ref3, ref4;
      cause = (ref3 = res != null ? res.statusCode : void 0) != null ? ref3 : err.message;
      error = new TunnelingError("tunneling socket could not be established: " + cause);
      error.statusCode = (ref4 = res != null ? res.statusCode : void 0) != null ? ref4 : 500;
      return cb(error);
    };
    onConnect = function(res, socket, head) {
      if (res.statusCode === 200) {
        if (proxyOptions.timeout != null) {
          socket.setTimeout(proxyOptions.timeout, function() {
            return socket.destroy();
          });
        }
        return cb(null, socket);
      } else {
        return onError(null, res);
      }
    };
    req = http.request(connectOptions);
    req.once('connect', onConnect);
    req.once('error', onError);
    return req.end();
  };

}).call(this);
