(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _qiniu = require('qiniu');

var _qiniu2 = _interopRequireDefault(_qiniu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client = null;

var bucket = null;

exports.default = function (key, localFile, accessKey, secretKey, bkt) {
  if (_qiniu2.default.conf.ACCESS_KEY != accessKey || _qiniu2.default.conf.SECRET_KEY != secretKey) {
    _qiniu2.default.conf.ACCESS_KEY = accessKey;
    _qiniu2.default.conf.SECRET_KEY = secretKey;
    client = new _qiniu2.default.rs.Client();
  }
  bucket = bkt;
  client.stat(bucket, key, function (err, ret) {
    if (!err) {
      console.log('already exist, upload after remove!');
      client.remove(bucket, key, function (err, ret) {
        if (!err) {
          console.log('removed!');

          upload(key, localFile);
        } else {
          console.log('remove failed:', err);
        }
      });
    } else {
      console.log('not exist, directly upload!');
      upload(key, localFile);
    }
  });
};

function upload(key, localFile) {
  var token = new _qiniu2.default.rs.PutPolicy(bucket + ":" + key).token();
  var extra = new _qiniu2.default.io.PutExtra();
  _qiniu2.default.io.putFile(token, key, localFile, extra, function (err, ret) {
    if (!err) {
      console.log('uploaded: ', ret.hash, ret.key);
    } else {
      console.log('upload failed:', err);
    }
  });
}

},{"qiniu":undefined}],2:[function(require,module,exports){
'use strict';

var _yuxd = require('../yuxd.json');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _qn = require('./qn.js');

var _qn2 = _interopRequireDefault(_qn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (process.argv.length < 3) {
  console.error('upload files please');
  process.exit(1);
}
var localFiles = process.argv.slice(2);

localFiles.forEach(function (lf, i) {
  (0, _qn2.default)(_path2.default.join(process.env.QNPATH || '', _path2.default.basename(lf)), lf, _yuxd.ACCESS_KEY, _yuxd.SECRET_KEY, _yuxd.bucket);
});

},{"../yuxd.json":3,"./qn.js":1,"path":undefined}],3:[function(require,module,exports){
module.exports={
  "bucket": "yulodl",
  "ACCESS_KEY": "JzngRcsxxcstDlWyha5wNFjRMb2GJDa5lqTFEthf",
  "SECRET_KEY": "M8TzqreioC1IwyCSACi5MZnAmzATYA1hlYwYXFDc"
}

},{}]},{},[2]);
