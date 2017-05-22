import fs from 'fs';
import path from 'path';
import tinify from 'tinify';
tinify.key = 'giHf9FmlbH-LRsLGQysdxO5KoDVlUukX';
const imgPrePath = './imgPre';
const imgHandledPath = './imgHandled';
const imgExtReg = /\.(?:png|jpe?g)$/i;
export default (cb) => {
  fs.readdir(imgPrePath, (err, imgs) => {
    if (err) console.error(err);
    console.log(imgs);
    imgs.forEach((img, i) => {
      const imgPath = path.join(imgPrePath, img);
      const handledImgPath = path.join(imgHandledPath, img);
      if (imgExtReg.test(img)) {
        const source = tinify.fromFile(imgPath);
        source.result().data().then((body) => {
          fs.writeFile(handledImgPath, body, (err) => {
            if (err) console.error(err);
            cb && cb(img, handledImgPath);
          });
        }).catch((err) => console.error(err));
      } else {
        console.log(imgPath, ' illegal image extension!!!');
      }
    });
  });
};
