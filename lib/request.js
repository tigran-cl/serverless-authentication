'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _url = require('url');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Request = function () {
  function Request(_ref) {
    var url = _ref.url;
    var _ref$method = _ref.method;
    var method = _ref$method === undefined ? 'GET' : _ref$method;
    var _ref$params = _ref.params;
    var params = _ref$params === undefined ? {} : _ref$params;

    _classCallCheck(this, Request);

    this.options = (0, _url.parse)(url);
    var port = this.options.protocol == 'http' ? 443 : 80;
    var path = this.options.path;
    if (!_lodash2.default.isEmpty(params)) {
      path += '?' + urlParams(params);
    }
    _lodash2.default.assign(this.options, { port: port, method: method, params: params, path: path });
  }

  _createClass(Request, [{
    key: 'make',
    value: function make() {
      var _this = this;

      var callback = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      var s = this.options.protocol == 'https:' ? _https2.default : _http2.default;
      return new Promise(function (resolve, reject) {
        var req = s.request(_this.options, function (res) {
          res.on('data', function (d) {
            var result = d.toString('utf8');
            if (callback) {
              callback(null, result);
            }
            resolve(result);
          });
        });
        req.end();
        req.on('error', function (e) {
          if (callback) {
            callback(e);
          }
          reject(e);
        });
      });
    }
  }]);

  return Request;
}();

exports.default = Request;


function urlParams(params) {
  var p = _lodash2.default.map(params, function (value, key) {
    return key + '=' + value;
  });
  return p.join('&');
}