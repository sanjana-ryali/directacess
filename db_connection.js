var mysql = require('mysql');
const uuidv4 = require('uuid/v4');
const ai = require('../config/analyze_image')

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
  saveSchoolReport: function(req, res) {
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
    const door_handle_img = (req.files['door_handle_image'] == undefined) ? "" : req.files['door_handle_image'][0].filename;
    const quiet_zone_img = (req.files['quiet_zone_image'] == undefined) ? "" : req.files['quiet_zone_image'][0].filename;
    const faucet_img = (req.files['faucet_image'] == undefined) ? "" : req.files['faucet_image'][0].filename;

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

    ai.processHandicapImage(handicap_parking_img);

    var values = [];

    values.push([id, req.body.num_parking, req.body.num_handi_parking, 
      handicap_parking_img, if_handi_stripes, handi_stripes_img, 
      if_ext_bleachers, if_wheelchair, if_multi,
      if_elevator, if_elevator_wide, if_ramp,
      if_ramp_wide, if_class_wheel, if_passage_wide,
      if_door_handle, door_handle_img, if_knee_clear,
      if_class_access_seats, if_listen_device, if_quiet_zone,
      quiet_zone_img, if_bath_sign, if_faucets, faucet_img
      ]);

    console.log("values: ");
    console.log(values);

    con.query('INSERT INTO school_reports VALUES ?', [values], function(err,result) {
        if (err) throw err;
        console.log("inserted data");
    });

    var reportsList = [];
    var schoolReportsList = [];

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
            'id':rows[0][i].id,
            'location':rows[0][i].location,
            'surveyors':rows[0][i].surveyors,
            'date':rows[0][i].date
          }
          reportsList.push(report);
        }
        for (var i = 0; i < rows[1].length; i++) {
          console.log(rows[1]);
          var schoolReport = {
            'num_parking':rows[1][i].num_parking,
            'num_handi_parking':rows[1][i].num_handi_parking,
            'handi_park_image':rows[1][i].handi_park_image,
            'if_wheelchair': !!+rows[1][i].if_wheelchair
          }
          schoolReportsList.push(schoolReport);
        }
        console.log("schoolReportsList in saveSchoolReport");
        console.log(schoolReportsList);
        console.log("reportsList in saveSchoolReport");
        console.log(reportsList);
        res.render('view_school_report', { reportsList: reportsList, schoolReportsList: schoolReportsList});
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
    const door_handle_img = (req.files['door_handle_image'] == undefined) ? "" : req.files['door_handle_image'][0].filename;
    const quiet_zone_img = (req.files['quiet_zone_image'] == undefined) ? "" : req.files['quiet_zone_image'][0].filename;
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
      if_quiet_zone, quiet_zone_img, req.body.total_guest_rooms,
      req.body.guest_rooms_rollin, req.body.guest_rooms_comms,if_wheel_turn, 
      if_clear_floor, if_door_passage, 
      if_door_handle, door_handle_img,
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