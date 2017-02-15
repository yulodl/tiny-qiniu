import config from './config.json';

import qiniu from 'qiniu';
qiniu.conf.ACCESS_KEY = config.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.SECRET_KEY;

//构建bucketmanager对象
const client = new qiniu.rs.Client();
//要上传的空间
const bucket = config.bucket;

//获取文件信息
client.stat(bucket, key, (err, ret) => {
  if (!err) {
    console.log('already exist, upload after remove!');
    client.remove(bucket, key, (err, ret) => {
      if (!err) {
        console.log('removed!');
        // ok
        upload();
      } else {
        console.log('remove failed:', err);
      }
    });
  } else {
    console.log('not exist, directly upload!');
    upload();
  }
});

function upload() {
  //生成上传 Token
  const token = uptoken(bucket, key);
  const extra = new qiniu.io.PutExtra();
  qiniu.io.putFile(token, key, localFile, extra, function(err, ret) {
    if(!err) {
      // 上传成功， 处理返回值
      console.log('uploaded: ', ret.hash, ret.key, ret.persistentId);
    } else {
      // 上传失败， 处理返回代码
      console.log('upload failed:', err);
    }
  });
}

//构建上传策略函数，设置回调的url以及需要回调给业务服务器的数据
function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  //putPolicy.callbackUrl = 'http://your.domain.com/callback';
  //putPolicy.callbackBody = 'filename=$(fname)&filesize=$(fsize)';
  return putPolicy.token();
}