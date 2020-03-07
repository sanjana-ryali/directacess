var express = require('express');
const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');
var dbconn = require('../config/db_connection')
var ai = require('../config/analyze_image')
var router = express.Router();
var multer = require('multer');

//multer object creation
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
  }
})
 
var upload = multer({ storage: storage })

var imgFileUpload = upload.fields([
	{ name: 'handi_park_image', maxCount:1}, 
	{ name: 'handi_stripes_image', maxCount:1},
	{ name: 'door_handle_image', maxCount:1},
	{ name: 'quiet_zone_image', maxCount:1},
	{ name: 'faucet_image', maxCount:1}
])

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
  ai.processHandicapImage("test-handi-pl.jpg");
  res.render('analytics', { title: 'Analytics' });
});

router.post('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/building_report', function (req, res, next) {

	const jsondata = JSON.parse(JSON.stringify(req.body));
	console.log(jsondata);
	var id = dbconn.saveData(req);
	console.log(id);

	console.log(jsondata.dropDown);
	if (jsondata.dropDown == "School"){
		res.render('school_survey', { title: 'School Survey', id: id});
	}
	else if (jsondata.dropDown == "Retail"){
		res.render('retail_survey', { title: 'Retail Survey', id: id});
	}
	else if (jsondata.dropDown == "Hotel"){
		res.render('hotel_survey', { title: 'Hotel Survey', id: id});
	}
	//var str2 = dbconn.saveData(req);
	//console.log(str2);
	//else res.render('save_report', { title: 'Save Report' });
});

router.post('/save_report', function (req, res) {
	imgFileUpload(req, res, function(err) {
		if(err){
			console.log("error has occured "+err);
		}
		else {
			console.log("calling db to save report");
			var successReport = dbconn.saveSchoolReport(req, res);
			console.log("School Report is successfully saved");
		}
	});
	
});

/*router.post('/save_image', upload.single('imageupload'),function(req, res) {
	console.log(req.file.filename);
	ai.processImage(req.file.filename);
	res.render('analytics', { title: 'Analytics' });
});*/
router.post('/save_hotel_report', function (req, res) {
	imgFileUpload(req, res, function(err) {
		if(err){
			console.log("error has occured "+err);
		}
		else {
			console.log("calling db to save report");
			var successReport = dbconn.saveHotelReport(req, res);
			console.log("Hotell Report is successfully saved");
		}
	});
	
});


module.exports = router;

