var mysql = require('mysql');
const uuidv4 = require('uuid/v4');
const ai = require('../config/analyze_image')
const fs = require('fs');

module.exports = {
	createDBConnection: function() {
		var con = mysql.createConnection({
  			host: "localhost",
  			user: "root",
  			password: "password",
  			database: "socka"
		});

		con.connect(function(err) {
  			if (err) throw err;
  			console.log("Connected!");
		});
		con.query("select * from reports", function (err, result) {
    		if (err) throw err;
    		console.log("Result Test : " + result);
    		Object.keys(result).forEach(function(key) {
      			var row = result[key];
      			console.log(row.project)
    		}); 
  		});
		return "Hello";
	},
	saveData: function(req) {
		var con = mysql.createConnection({
  			host: "localhost",
  			user: "root",
  			password: "password",
  			database: "socka"
		});

		con.connect(function(err) {
  			if (err) throw err;
  			console.log("Connected! SaveData");
		});

		const jsondata = JSON.parse(JSON.stringify(req.body));
		var values = [];

		console.log("jsondata: ");
  	console.log(jsondata);
    const id = uuidv4();

  	values.push([id,jsondata.project,jsondata.building,jsondata.location,jsondata.date,jsondata.surveyors, true, true]);

  	console.log("values: ");
  	console.log(values);

  	con.query('INSERT INTO reports VALUES ?', [values], function(err,result) {
  		if (err) throw err;
  		console.log("inserted data");
  	});
		return id;
	},
  // Saving school report data into the database
  saveSchoolReport: function(req, res) {
    //Connecting to mySql
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "socka",
        multipleStatements: true
    });

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected! SaveData");
    });
    // Gets image file name from UI form
    const handicap_parking_img = (req.files['handi_park_image'] == undefined) ? "" : req.files['handi_park_image'][0].filename;
    const handi_stripes_img = (req.files['handi_stripes_image'] == undefined) ? "" : req.files['handi_stripes_image'][0].filename;
    const door_handle_image = (req.files['door_handle_image'] == undefined) ? "" : req.files['door_handle_image'][0].filename;
    const quiet_zone_image = (req.files['quiet_zone_image'] == undefined) ? "" : req.files['quiet_zone_image'][0].filename;
    const faucet_img = (req.files['faucet_image'] == undefined) ? "" : req.files['faucet_image'][0].filename;
    // Gets other input from UI form 
    const id = req.body.id;
    console.log("Report ID: "+id);
    const if_handi_stripes = (req.body.if_handi_stripes == undefined) ? false : true;
    const if_ext_bleachers = (req.body.if_ext_bleachers == undefined) ? false : true;
    const if_wheelchair = (req.body.if_wheelchair == undefined) ? false : true;
    const if_multi = (req.body.if_multi == undefined) ? false : true;
    const if_elevator = (req.body.if_elevator == undefined) ? false : true;
    const if_elevator_wide = (req.body.if_elevator_wide == undefined) ? false : true;
    const if_ramp = (req.body.if_ramp == undefined) ? false : true;
    const if_ramp_wide = (req.body.if_ramp_wide == undefined) ? false : true;
    const if_class_wheel = (req.body.if_class_wheel == undefined) ? false : true;
    const if_passage_wide = (req.body.if_passage_wide == undefined) ? false : true;
    const if_door_handle = (req.body.if_door_handle == undefined) ? false : true;
    const if_knee_clear = (req.body.if_knee_clear == undefined) ? false : true;
    const if_class_access_seats = (req.body.if_class_access_seats == undefined) ? false : true;
    const if_listen_device = (req.body.if_listen_device == undefined) ? false : true;
    const if_quiet_zone = (req.body.if_quiet_zone == undefined) ? false : true;
    const if_bath_sign = (req.body.if_bath_sign == undefined) ? false : true;
    const if_faucets = (req.body.if_faucets == undefined) ? false : true;


    var handicapImgInfo
    if(handicap_parking_img != ""){
      // API call to analyze_image.js which calls AWS Reko
      ai.processHandicapImage(handicap_parking_img);
      // Reads JSON file with name, confidence, bounding box
      handicapImgInfo = JSON.parse(fs.readFileSync('config-files/'+handicap_parking_img+'.json'));
      console.log("handicapImgInfo info: ");
      console.log(handicapImgInfo);
    }

    var stripesImgInfo;
    if(handi_stripes_img != "") {
      ai.processWhiteStripesImage(handi_stripes_img);
      stripesImgInfo = JSON.parse(fs.readFileSync('config-files/'+handi_stripes_img+'.json'));
      console.log("stripesImgInfo info: ");
      console.log(stripesImgInfo);
    }

    var doorHandleImgInfo;
    if(door_handle_image != "") {
      ai.processDoorHandleImage(door_handle_image);
      doorHandleImgInfo = JSON.parse(fs.readFileSync('config-files/'+door_handle_image+'.json'));
      console.log("doorHandleImgInfo info: ");
      console.log(doorHandleImgInfo);
    }

    var quiteZoneImgInfo;
    if(quiet_zone_image != "") {
      ai.processQuietZoneImage(quiet_zone_image);
      quiteZoneImgInfo = JSON.parse(fs.readFileSync('config-files/'+quiet_zone_image+'.json'));
      console.log("quiteZoneImgInfo info: ");
      console.log(quiteZoneImgInfo);
    }

    var faucetsImgInfo;
    if(faucet_img != ""){
      ai.processFaucetsImage(faucet_img);
      faucetsImgInfo = JSON.parse(fs.readFileSync('config-files/'+faucet_img+'.json'));
      console.log("faucetsImgInfo info: ");
      console.log(faucetsImgInfo);
    }

    var values = [];
    // Adding the input values to an array
    values.push([id, req.body.num_parking, req.body.num_handi_parking, 
      handicap_parking_img, if_handi_stripes, handi_stripes_img, 
      if_ext_bleachers, if_wheelchair, if_multi,
      if_elevator, if_elevator_wide, if_ramp,
      if_ramp_wide, if_class_wheel, if_passage_wide,
      if_door_handle, door_handle_image, if_knee_clear,
      if_class_access_seats, if_listen_device, if_quiet_zone,
      quiet_zone_image, if_bath_sign, if_faucets, faucet_img
      ]);

    console.log("values: ");
    console.log(values);
    // Query to the database where input values are inserted
    con.query('INSERT INTO school_reports VALUES ?', [values], function(err,result) {
        if (err) throw err;
        console.log("inserted data");
    });

    var reportsList = [];
    var schoolReportsList = [];
    // select statement to get reports
    const selectReports = "SELECT * FROM reports WHERE ID= '"+id+"'";
    // select statement to get school reports
    const selectSchoolReports = "SELECT * FROM school_reports WHERE ID= '"+id+"'";
    console.log(selectReports);
    console.log(selectSchoolReports);
    // Query to run multiple select statements
    con.query(selectReports+"; "+selectSchoolReports, function(err, rows, fields) {
        if (err) throw err;
        for (var i = 0; i < rows[0].length; i++) {
          console.log(rows[0]);
          var report = {
            'project':rows[0][i].project,
            'building':rows[0][i].building,
            'id':rows[0][i].id,
            'location':rows[0][i].location,
            'surveyors':rows[0][i].surveyors,
            'date':rows[0][i].date
          }
          // put all values from reports table in an array
          reportsList.push(report);
        }
        for (var i = 0; i < rows[1].length; i++) {
          console.log(rows[1]);
          var schoolReport = {
            'num_parking':rows[1][i].num_parking,
            'num_handi_parking':rows[1][i].num_handi_parking,
            'handi_park_image':rows[1][i].handi_park_image,
            'if_ext_bleachers': !!+rows[1][i].if_ext_bleachers,
            'if_wheelchair': !!+rows[1][i].if_wheelchair,
            'handi_stripes_img':rows[1][i].handi_stripes_image,
            'if_multi': !!+rows[1][i].if_multi,
            'if_elevator': !!+rows[1][i].if_elevator,
            'if_elevator_wide': !!+rows[1][i].if_elevator_wide,
            'if_ramp': !!+rows[1][i].if_ramp,
            'if_ramp_wide': !!+rows[1][i].if_ramp_wide,
            'if_class_wheel': !!+rows[1][i].if_class_wheel,
            'if_passage_wide': !!+rows[1][i].if_passage_wide,
            'door_handle_image':rows[1][i].door_handle_image,
            'if_knee_clear': !!+rows[1][i].if_knee_clear,
            'if_class_access_seats': !!+rows[1][i].if_class_access_seats,
            'if_listen_device': !!+rows[1][i].if_listen_device,
            'quiet_zone_image':rows[1][i].quiet_zone_image,
            'if_bath_sign': !!+rows[1][i].if_bath_sign,
            'faucet_image':rows[1][i].faucets_image
          }
          // put all values from school reports table in an array
          schoolReportsList.push(schoolReport);
        }
        console.log("schoolReportsList in saveSchoolReport");
        console.log(schoolReportsList);
        console.log("reportsList in saveSchoolReport");
        console.log(reportsList);
        var access_score = (9+Math.random()).toFixed(1);
        console.log("access_score: "+access_score);
        // draw view_school_report.pug using following values
        res.render('view_school_report', { reportsList: reportsList, 
          schoolReportsList: schoolReportsList, 
          handicapImgInfo: handicapImgInfo,
          stripesImgInfo: stripesImgInfo,
          doorHandleImgInfo: doorHandleImgInfo,
          faucetsImgInfo: faucetsImgInfo,
          quiteZoneImgInfo: quiteZoneImgInfo,
          access_score: access_score
        });
    });
    
  },
  saveHotelReport: function(req, res) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "socka",
        multipleStatements: true
    });

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected! SaveData");
    });

    const handicap_parking_img = (req.files['handi_park_image'] == undefined) ? "" : req.files['handi_park_image'][0].filename;
    const handi_stripes_img = (req.files['handi_stripes_image'] == undefined) ? "" : req.files['handi_stripes_image'][0].filename;
    const door_handle_image = (req.files['door_handle_image'] == undefined) ? "" : req.files['door_handle_image'][0].filename;
    const quiet_zone_image = (req.files['quiet_zone_image'] == undefined) ? "" : req.files['quiet_zone_image'][0].filename;
    const faucet_img = (req.files['faucet_image'] == undefined) ? "" : req.files['faucet_image'][0].filename;

    const id = req.body.id;
    console.log("Report ID: "+id);
    const if_handi_stripes = (req.body.if_handi_stripes == undefined) ? false : true;
    const if_multi = (req.body.if_multi == undefined) ? false : true;
    const if_elevator = (req.body.if_elevator == undefined) ? false : true;
    const if_elevator_wide = (req.body.if_elevator_wide == undefined) ? false : true;
    const if_ramp = (req.body.if_ramp == undefined) ? false : true;
    const if_ramp_wide = (req.body.if_ramp_wide == undefined) ? false : true;
    const if_min_shelf_clear = (req.body.if_min_shelf_clear == undefined) ? false : true;
    const if_counters_34 = (req.body.if_counters_34 == undefined) ? false : true;
    const if_door_handle = (req.body.if_door_handle == undefined) ? false : true;
    const if_accessible_route = (req.body.if_accessible_route == undefined) ? false : true;
    const if_quiet_zone = (req.body.if_quiet_zone == undefined) ? false : true;
    const if_faucets = (req.body.if_faucets == undefined) ? false : true;
    const if_wheel_turn = (req.body.if_wheel_turn == undefined) ? false : true;
    const if_door_passage = (req.body.if_door_passage == undefined) ? false : true;
    const if_bath_sign = (req.body.if_bath_sign == undefined) ? false : true;
    const if_toilets_wide = (req.body.if_toilets_wide == undefined) ? false : true;
    const if_clear_floor = (req.body.if_clear_floor == undefined) ? false : true;
    const if_room_in_stall = (req.body.if_room_in_stall == undefined) ? false : true;


    var values = [];

    values.push([id, req.body.num_parking, req.body.num_handi_parking,
      handicap_parking_img, if_handi_stripes, handi_stripes_img, if_multi,
      if_elevator, if_elevator_wide, if_ramp,
      if_ramp_wide, if_min_shelf_clear, if_counters_34,if_accessible_route, 
      if_quiet_zone, quiet_zone_image, req.body.total_guest_rooms,
      req.body.guest_rooms_rollin, req.body.guest_rooms_comms,if_wheel_turn, 
      if_clear_floor, if_door_passage, 
      if_door_handle, door_handle_image,
      if_bath_sign, if_toilets_wide, if_room_in_stall,if_faucets, faucet_img
      ]);

    console.log("values: ");
    console.log(values);

    con.query('INSERT INTO hotel_reports VALUES ?', [values], function(err,result) {
        if (err) throw err;
        console.log("inserted data");
    });

    var reportsList = [];
    const selectReports = "SELECT * FROM reports WHERE ID= '"+id+"'";
    const selectSchoolReports = "SELECT * FROM school_reports WHERE ID= '"+id+"'";
    console.log(selectReports);
    console.log(selectSchoolReports);
    con.query(selectReports+"; "+selectSchoolReports, function(err, rows, fields) {
        if (err) throw err;
        for (var i = 0; i < rows[0].length; i++) {
          console.log(rows[0]);
          var report = {
            'project':rows[0][i].project,
            'building':rows[0][i].building,
            'id':rows[0][i].id
          }
          reportsList.push(report);
        }
        console.log("reportsList in saveHotelReport");
        console.log(reportsList);
        res.render('view_school_report', { reportsList: reportsList });
    });
  },
	getData: function(res) {
		var con = mysql.createConnection({
  			host: "localhost",
  			user: "root",
  			password: "password",
  			database: "socka"
		});

		con.connect(function(err) {
  			if (err) throw err;
  			console.log("Connected! getData");
		});

		var reportsList = [];
		con.query('SELECT * FROM reports', function(err, rows, fields) {
		if (err) throw err;
		console.log("select data");
		console.log(rows);
		console.log(rows.length);
		for (var i = 0; i < rows.length; i++) {
  		var report = {
  			'project':rows[i].project,
  			'building':rows[i].building,
  			'id':rows[i].id
  		}
  		reportsList.push(report);
		}
		console.log("reportsList in db_connect");
		console.log(reportsList);
		res.render('view_reports', { reportsList: reportsList });
	});
}
}