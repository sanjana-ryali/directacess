var mysql = require('mysql');
const uuidv4 = require('uuid/v4');

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

  		values.push([uuidv4(),jsondata.project,jsondata.building,jsondata.location,jsondata.date,jsondata.surveyors, true, true]);

  		console.log("values: ");
  		console.log(values);

  		con.query('INSERT INTO reports VALUES ?', [values], function(err,result) {
  			if (err) throw err;
  			console.log("inserted data");
  		});
		return "Hello saveData";
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