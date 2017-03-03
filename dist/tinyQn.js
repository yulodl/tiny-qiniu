'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _config = require('../config.json');

var _config2 = _interopRequireDefault(_config);

var _tinify = require('tinify');

var _tinify2 = _interopRequireDefault(_tinify);

var _qiniu = require('qiniu');

var _qiniu2 = _interopRequireDefault(_qiniu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tinify2.default.key = _config2.default.key;

_qiniu2.default.conf.ACCESS_KEY = _config2.default.ACCESS_KEY;
_qiniu2.default.conf.SECRET_KEY = _config2.default.SECRET_KEY;

//构建bucketmanager对象
var client = new _qiniu2.default.rs.Client();
//要上传的空间
var bucket = _config2.default.bucket;

var imgPrePath = './imgPre';
var imgHandledPath = './imgHandled';
var imgExtReg = /\.(?:png|jpe?g)$/i;
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
          handleImg(_path2.default.join(process.env.QNPATH || '', img), handledImgPath);
        });
      }).catch(function (err) {
        return console.error(err);
      });
    } else {
      console.log(imgPath, ' illegal image extension!!!');
    }
  });
});

//获取文件信息
var handleImg = function handleImg(key, localFile) {
  client.stat(bucket, key, function (err, ret) {
    if (!err) {
      console.log('already exist, upload after remove!');
      client.remove(bucket, key, function (err, ret) {
        if (!err) {
          console.log('removed!');
          // ok
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
  //生成上传 Token
  var token = uptoken(bucket, key);
  var extra = new _qiniu2.default.io.PutExtra();
  _qiniu2.default.io.putFile(token, key, localFile, extra, function (err, ret) {
    if (!err) {
      // 上传成功， 处理返回值
      console.log('uploaded: ', ret.hash, ret.key);
    } else {
      // 上传失败， 处理返回代码
      console.log('upload failed:', err);
    }
  });
}

//构建上传策略函数，设置回调的url以及需要回调给业务服务器的数据
function uptoken(bucket, key) {
  var putPolicy = new _qiniu2.default.rs.PutPolicy(bucket + ":" + key);
  //putPolicy.callbackUrl = 'http://your.domain.com/callback';
  //putPolicy.callbackBody = 'filename=$(fname)&filesize=$(fsize)';
  return putPolicy.token();
}