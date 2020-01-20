var express = require('express');
const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');
var dbconn = require('../config/db_connection')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/create_report', function(req, res, next) {
  res.render('create_report', { title: 'Create Report' });
});
router.get('/view_reports', function(req, res, next) {
  dbconn.getData(res);
});
router.get('/analytics', function(req, res, next) {
  res.render('analytics', { title: 'Analytics' });
});

router.post('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/save_report', function (req, res, next) {
	var str2 = dbconn.saveData(req);
	console.log(str2);
	res.render('save_report', { title: 'Save Report' });
});

module.exports = router;

