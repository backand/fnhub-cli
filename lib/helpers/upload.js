var AWS 		= require('aws-sdk');
var fs 			= require('fs');
var _ 			= require('lodash');
var toCamel = require('./string-helper').toCamel;

function uploadOneFile(credentials, fileName, bucket, key, fnhub, callback){
	var readStream = fs.createReadStream(fileName);
	var params = {Bucket: bucket, Key: key, Body: readStream, ACL: 'public-read'};
	var options = { partSize: 5 * 1024 * 1024, queueSize: 10 };
	credentials = JSON.parse(JSON.stringify(toCamel(credentials)));
	AWS.config.update(credentials);
  var s3 = new AWS.S3({ httpOptions: { timeout: 10 * 60 * 1000 }});
	s3.upload(params, options)
  	.on('httpUploadProgress', function(evt) { 
  		fnhub.logger.log('Completed ' + (evt.loaded * 100 / evt.total).toFixed() + '% of upload');
  	})
    .send(function(err, data) { 
			callback(err);
    });
}

function upload(credentials, bucket, folder, zipFileName, zipFile, fnhub, callback){
  uploadOneFile(credentials, zipFile, bucket, folder + "/" + zipFileName, fnhub, callback);
}

module.exports.upload = upload;