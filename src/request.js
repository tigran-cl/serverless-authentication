'use strict';

import {parse} from 'url';
import _ from 'lodash';
import https from 'https';
import http from 'http';
import querystring from 'querystring';
import Utils from './utils';

export default function request({url, method, params}, callback) {
  let req = new Request({url, method, params});
  req.make(callback);
}

class Request {
  constructor({url, method = 'GET', params = {}}){
    this.options = parse(url);
    let port = this.options.protocol == 'https:' ? 443 : 80;
    let path = this.options.path;
    if(!_.isEmpty(params)) {
      if(method === 'GET') {
        path += '?' + Utils.urlParams(params)
      }
      if(method === 'POST') {
        this.options.postData = querystring.stringify(params);
        this.options.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': this.options.postData.length
        }
      }
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
    if(this.options.postData) {
      req.write(this.options.postData);
    }
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