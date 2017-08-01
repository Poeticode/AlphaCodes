var express = require('express');
var app = express();
const path = require('path');


app
    .use(express.static('build'))
    // .use('/dynamic', express.static(path.join('_src','/hbs','/data', '/dynamic')))
    .listen(23485);

console.log('running at localhost:23485');