import qiniu from 'qiniu';
//构建bucketmanager对象
let client = null;
//要上传的空间
let bucket = null;

//获取文件信息
export default (key, localFile, accessKey, secretKey, bkt) => {
  if (qiniu.conf.ACCESS_KEY != accessKey || qiniu.conf.SECRET_KEY != secretKey) {
    qiniu.conf.ACCESS_KEY = accessKey;
    qiniu.conf.SECRET_KEY = secretKey;
    client = new qiniu.rs.Client();
  }
  bucket = bkt;
  client.stat(bucket, key, (err, ret) => {
    if (!err) {
      console.log('already exist, upload after remove!');
      client.remove(bucket, key, (err, ret) => {
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
  const token = new qiniu.rs.PutPolicy(bucket+":"+key).token();
  const extra = new qiniu.io.PutExtra();
  qiniu.io.putFile(token, key, localFile, extra, (err, ret) => {
    if(!err) {
      // 上传成功， 处理返回值
      console.log('uploaded: ', ret.hash, ret.key);
    } else {
      // 上传失败， 处理返回代码
      console.log('upload failed:', err);
    }
  });
}

  /*
//构建上传策略函数，设置回调的url以及需要回调给业务服务器的数据
function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  //putPolicy.callbackUrl = 'http://your.domain.com/callback';
  //putPolicy.callbackBody = 'filename=$(fname)&filesize=$(fsize)';
  return putPolicy.token();
}
*/
