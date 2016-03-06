'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = request;

var _url = require('url');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function request(_ref, callback) {
  var url = _ref.url;
  var method = _ref.method;
  var params = _ref.params;

  var req = new Request({ url: url, method: method, params: params });
  req.make(callback);
}

var Request = function () {
  function Request(_ref2) {
    var url = _ref2.url;
    var _ref2$method = _ref2.method;
    var method = _ref2$method === undefined ? 'GET' : _ref2$method;
    var _ref2$params = _ref2.params;
    var params = _ref2$params === undefined ? {} : _ref2$params;

    _classCallCheck(this, Request);

    this.options = (0, _url.parse)(url);
    var port = this.options.protocol == 'https:' ? 443 : 80;
    var path = this.options.path;
    if (!_lodash2.default.isEmpty(params)) {
      path += '?' + urlParams(params);
    }
    _lodash2.default.assign(this.options, { port: port, method: method, params: params, path: path });
  }

  _createClass(Request, [{
    key: 'make',
    value: function make() {
      var callback = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      var s = this.options.protocol == 'https:' ? _https2.default : _http2.default;
      var req = s.request(this.options, function (res) {
        res.on('data', function (d) {
          var result = JSON.parse(d.toString('utf8'));
          if (callback) {
            callback(null, result);
          }
        });
      });
      req.end();
      req.on('error', function (e) {
        if (callback) {
          callback(e);
        }
      });

      /*
      // Promise fails due to the version of node in AWS Lambda
      return new Promise((resolve, reject) => {
        let req = s.request(this.options, (res) => {
          res.on('data', (d) => {
            let result = JSON.parse(d.toString('utf8'));
            if(callback) {
              callback(null, result);
            }
            resolve(result);
          });
        });
        req.end();
        req.on('error', (e) => {
          if(callback) {
            callback(e);
          }
          reject(e);
        });
      });*/
    }
  }]);

  return Request;
}();

function urlParams(params) {
  var p = _lodash2.default.map(params, function (value, key) {
    return key + '=' + value;
  });
  return p.join('&');
}