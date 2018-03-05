import Bucket from './bucket';
require('./index.less');


window.bucket = new Bucket(document.querySelector('#tetris'));

window.bucket.tick();

