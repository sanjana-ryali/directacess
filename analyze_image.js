
var AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');

module.exports = {
	processImage: function(filename) {
		console.log("Calling AWS Rekognition");
    	var rekognition = new AWS.Rekognition();

		var params = {
			ProjectVersionArn: "arn:aws:rekognition:us-east-2:157455518881:project/better-parking-lot-project/version/better-parking-lot-project.2020-02-11T15.26.50/1581463610525",
			Image: {
				S3Object: {
   					Bucket: "testing-data-ada", 
   					Name: filename,
  				}
 			},
		};
		rekognition.detectCustomLabels(params, function(err, data) {""
			if (err) console.log(err, err.stack); // an error occurred
			else console.log(data);           // successful response
		});
    	
	}
}