import { bucket, ACCESS_KEY, SECRET_KEY } from '../yuxd.json';
import path from 'path';
import uploadFile from './qn.js';

if (process.argv.length < 3) {
  console.error('upload files please');
  process.exit(1);
}
const localFiles = process.argv.slice(2);

localFiles.forEach((lf, i) => {
  uploadFile(path.join(process.env.QNPATH||'', path.basename(lf)), lf, ACCESS_KEY, SECRET_KEY, bucket);
});
