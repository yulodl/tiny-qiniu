import { bucket, ACCESS_KEY, SECRET_KEY } from '../ywxx.json';
import path from 'path';
import tinyImg from './tinyImg.js';
import uploadFile from './qn.js';

tinyImg((img, handledImgPath) => {
  uploadFile(path.join(process.env.QNPATH||'', img), handledImgPath, ACCESS_KEY, SECRET_KEY, bucket);
});

