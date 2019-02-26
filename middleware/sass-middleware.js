var path = require('path');
var sassMiddleware = require('node-sass-middleware');


const options = {
   src: __dirname,
   dest: path.join(__dirname, 'public'),
   debug: true,
   outputStyle: 'compressed',
   prefix: '/scss'
};

module.exports = sassMiddleware(options);
