'use strict';

import {parse} from 'url';
import _ from 'lodash';
import https from 'https';
import http from 'http';

export default function request({url, method, params}, callback) {
  let req = new Request({url, method, params});
  req.make(callback);
}

class Request {
  constructor({url, method = 'GET', params = {}}){
    this.options = parse(url);
    let port = this.options.protocol == 'https:' ? 443 : 80;
    let path = this.options.path;
    if(!_.isEmpty(params)){
      path += '?' + urlParams(params)
    }
    _.assign(this.options, {port, method, params, path});
  }

  make (callback = null) {
    let s = this.options.protocol == 'https:' ? https : http;
    let req = s.request(this.options, (res) => {
      res.on('data', (d) => {
        let result = JSON.parse(d.toString('utf8'));
        if(callback) {
          callback(null, result);
        }
      });
    });
    req.end();
    req.on('error', (e) => {
      if(callback) {
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
}

function urlParams(params) {
  let p = _.map(params, (value, key) => {
    return key+'='+value
  });
  return p.join('&');
}