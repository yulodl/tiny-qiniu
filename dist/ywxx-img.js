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

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _tinify = require('tinify');

var _tinify2 = _interopRequireDefault(_tinify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tinify2.default.key = 'giHf9FmlbH-LRsLGQysdxO5KoDVlUukX';
var imgPrePath = './imgPre';
var imgHandledPath = './imgHandled';
var imgExtReg = /\.(?:png|jpe?g)$/i;

exports.default = function (cb) {
  _fs2.default.readdir(imgPrePath, function (err, imgs) {
    if (err) console.error(err);
    console.log(imgs);
    imgs.forEach(function (img, i) {
      var imgPath = _path2.default.join(imgPrePath, img);
      var handledImgPath = _path2.default.join(imgHandledPath, img);
      if (imgExtReg.test(img)) {
        var source = _tinify2.default.fromFile(imgPath);
        source.result().data().then(function (body) {
          _fs2.default.writeFile(handledImgPath, body, function (err) {
            if (err) console.error(err);
            cb && cb(img, handledImgPath);
          });
        }).catch(function (err) {
          return console.error(err);
        });
      } else {
        console.log(imgPath, ' illegal image extension!!!');
      }
    });
  });
};

},{"fs":undefined,"path":undefined,"tinify":undefined}],3:[function(require,module,exports){
'use strict';

var _tinyImg = require('./tinyImg.js');

var _tinyImg2 = _interopRequireDefault(_tinyImg);

var _qn = require('./qn.js');

var _qn2 = _interopRequireDefault(_qn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tinyImg2.default)(function (img, handledImgPath) {
  (0, _qn2.default)(path.join(process.env.QNPATH || '', img), handledImgPath, ACCESS_KEY, SECRET_KEY, bucket);
});

},{"./qn.js":1,"./tinyImg.js":2}],4:[function(require,module,exports){
'use strict';

var bucket = 'yunwang',
    ACCESS_KEY = '-73hNJzJT-ix5sqFX5XCkJHixcxvIZvFu2EEhJzb',
    SECRET_KEY = 'DWr2scPk2irlQiiqnyPpiyytWmpxAvQQbYa1DdUq';

},{}]},{},[4,3]);
