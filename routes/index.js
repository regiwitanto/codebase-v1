const express = require('express');
const router = express.Router();
const response = require('../helpers/utils/response');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  response.ok(res, 'success', 'This service is running properly');
});

module.exports = router;
