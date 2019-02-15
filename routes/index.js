var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MachineVue API' });
});


/** **/

router.use('/users', require('./users'));

module.exports = router;
