
// import AWS Rekogntion libraries, AWS SDK installed as a node module
var AWS = require('aws-sdk'); 
// Node library to get the size of the image
var sizeOf = require('image-size');
// library to get all file commands
const fs = require('fs');
// loading AWS config, loggin in to AWS
AWS.config.loadFromPath('./config.json');

module.exports = {
	//not using this method
	processImage: function(filename) {
		console.log("Calling AWS Rekognition");
    	var rekognition = new AWS.Rekognition();

		var params = {
			ProjectVersionArn: "arn:aws:rekognition:us-east-2:157455518881:project/better-parking-lot-project/version/better-parking-lot-project.2020-02-11T15.26.50/1581463610525",
			Image: {
				S3Object: {
   					Bucket: "testing-data-direct-access", 
   					Name: filename,
  				}
 			},
		};
		rekognition.detectCustomLabels(params, function(err, data) {""
			if (err) console.log(err, err.stack); // an error occurred
			else console.log(data);           // successful response
		});
    	
	},
	// processing handicapped parking image 
	processHandicapImage: function(filename) {
		console.log("Calling AWS Rekognition "+filename);
    	
		var params = {
			ProjectVersionArn: "arn:aws:rekognition:us-east-2:134790762361:project/Handicapped_Parking/version/Handicapped_Parking.2020-02-20T17.04.29/1582247070057",
			Image: {
				S3Object: {
   					Bucket: "testing-data-direct-access", 
   					Name: filename,
  				}
 			},
		};
		processAPICall(params, filename);
    	
	},
	processWhiteStripesImage: function(filename) {
		console.log("Calling AWS Rekognition");

		var params = {
			ProjectVersionArn: "arn:aws:rekognition:us-east-2:134790762361:project/White_Stripes_Handicapped_Parking/version/White_Stripes_Handicapped_Parking.2020-02-21T16.42.12/1582332132953",
			Image: {
				S3Object: {
   					Bucket: "testing-data-direct-access", 
   					Name: filename,
  				}
 			},
		};
    	processAPICall(params, filename);
	},
	processDoorHandleImage: function(filename) {
		console.log("Calling AWS Rekognition");

		var params = {
			ProjectVersionArn: "arn:aws:rekognition:us-east-2:134790762361:project/Door_Handle/version/Door_Handle.2020-02-19T14.17.46/1582150666420",
			Image: {
				S3Object: {
   					Bucket: "testing-data-direct-access", 
   					Name: filename,
  				}
 			},
		};
		processAPICall(params, filename);
    	
	},
	processQuietZoneImage: function(filename) {
		console.log("Calling AWS Rekognition");

		var params = {
			ProjectVersionArn: "arn:aws:rekognition:us-east-2:134790762361:project/Quiet_Zone/version/Quiet_Zone.2020-02-18T15.59.11/1582070351386",
			Image: {
				S3Object: {
   					Bucket: "testing-data-direct-access", 
   					Name: filename,
  				}
 			},
		};
		processAPICall(params, filename);
    	
	},
	processFaucetsImage: function(filename) {
		console.log("Calling AWS Rekognition");

		var params = {
			ProjectVersionArn: "arn:aws:rekognition:us-east-2:134790762361:project/Faucets/version/Faucets.2020-02-29T17.09.41/1583024981384",
			Image: {
				S3Object: {
   					Bucket: "testing-data-direct-access", 
   					Name: filename,
  				}
 			},
		};
		processAPICall(params, filename);
    	
	}
}
function processAPICall(params, filename){
	// instantiate Rekognition
	var rekognition = new AWS.Rekognition();
	console.log(params);
	console.log(filename);
	// no operation
	if(filename == "") return;
	// getting image dimensions (height and width)
	var dim = sizeOf('public/images/'+filename);

	console.log(dim);
	// API Call to AWS Rekognition
	rekognition.detectCustomLabels(params, function(err, data) {""
		if (err) {
			//console.log(err, err.stack); // an error occurred
		}
		else {
			console.log(data); 
			console.log(JSON.stringify(data));
			// Converting returned data into JSON
			var jsonData = JSON.parse(JSON.stringify(data));
			console.log(jsonData.CustomLabels.length);
			// for each label returned
			for (var i = 0; i < jsonData.CustomLabels.length; i++) {
				var handicapImgInfo = {
					'name':jsonData.CustomLabels[i].Name,
					'confidence':(jsonData.CustomLabels[i].Confidence).toFixed(1),
					// Drawing bounding boxes using ratio
					'width':jsonData.CustomLabels[i].Geometry.BoundingBox.Width * dim.width,
					'height':jsonData.CustomLabels[i].Geometry.BoundingBox.Height * dim.height,
					'left':jsonData.CustomLabels[i].Geometry.BoundingBox.Left * dim.width,
					'top':jsonData.CustomLabels[i].Geometry.BoundingBox.Top * dim.height
				}
				console.log(handicapImgInfo);
				// write to JSON file
				fs.writeFileSync('config-files/'+filename+'.json', JSON.stringify(handicapImgInfo, null, 2));
			}
		}         
	});
}