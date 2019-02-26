const express = require('express');
const router = express.Router();
const path = require('path');


const stylePath = '../public/stylesheets/style.css';


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: ' DDS', cssPath: stylePath });
});


/** **/

router.use('/users', require('./users'));

module.exports = router;
