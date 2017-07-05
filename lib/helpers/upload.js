var AWS = require('aws-sdk');
var fs = require('fs');
var _ = require('lodash');



function uploadOneFile(credentials, fileName, bucket, key, callback){
	var readStream = fs.createReadStream(fileName);
	var params = {Bucket: bucket, Key: key, Body: readStream};
	var options = { partSize: 5 * 1024 * 1024, queueSize: 10 };
	credentials = _.mapKeys(credentials, (key) => _.camelCase(key));
	AWS.config.update(credentials);
  var s3 = new AWS.S3({ httpOptions: { timeout: 10 * 60 * 1000 }});
	s3.upload(params, options)
  	.on('httpUploadProgress', function(evt) { 
  		console.log('Completed ' + (evt.loaded * 100 / evt.total).toFixed() + '% of upload');
  	})
    .send(function(err, data) { 
			console.log('Wait while we configure...');
			callback(err);
    });
}

function upload(credentials, bucket, folder, zipFileName, zipFile, callback){
  uploadOneFile(credentials, zipFile, bucket, folder + "/" + zipFileName, callback);
}

module.exports.upload = upload;

// var credentials = 
// {
//   "responseMetadata": {
//     "requestId": "deabba03-5da6-11e7-813b-a9ccf009ff47"
//   },
//   "credentials": {
//     "accessKeyId": "ASIAJ5E2NRNBWQNMWWVA",
//     "secretAccessKey": "z9/vuFC70MzCV18RlL8kuuStl2Ukqu8CzzdyZPRW",
//     "sessionToken": "FQoDYXdzEJD//////////wEaDN1CzEhZNKY7/NwK7CKwA8yazYc4mNx4Xtc0Bo2a3mCfwphCSmzkkiOM0sgrp4MRkuekYHVu/jF/0U1ccvoz20MbMBvXYH+GlOh3XC+7V4b6aSB0OELnYVcQ7fQCIqH2cQGPR8jePS93sHuG901bGKW6504JXrpnOtq6XwxdXWXhe/sGWJA47GasAUGZl5zVLfY3hnConaXnxknfxr8LsCJQ6Q4Q6BHQQIUKNLrvuGIv7Ise0qVklxXN3ztMORyng8t04HbKNALo2XMSf4TrQQMtXtzCiiGbJHt5h+N4Ns3HyrCXxx0iF9KRuvEeuCpM8dAtmz+ptr7o268x55gUq8Yf64CTTw6NddHc8jfqjj9nP2rrf5GTk2Jk5niGkNPo4qzbWqyh04ERVPGARtlUclxI0/S38WJXxJpazLMX1wExIQzo1BaWjXnCgBc702hmEbLdIfbSc8GzTeQ8hw8tdmDFsnRrRDx/olu1cgg18iDtqFeC7pYo7vlpHe7fLimvhDUHD3T8JLeb9xPGMjETohtVmoT+3fQ6Ud8G+DCo9KNcZz64ENJSNKg+HxlNoPR2PpvPj8F9tEAs8whNn7s2lSju1dnKBQ=="
//   },
//   "assumedRoleUser": {
//     "assumedRoleId": "AROAJPMTGYY5RYUHVVEFE:7c249",
//     "arn": "arn:aws:sts::328923390206:assumed-role/hosting/7c249"
//   },
//   "packedPolicySize": 53,
//   "info": {
//     "bucket": "nodejs.backand.io",
//     "dir": "clitest"
//   }
// };

// upload(credentials, 'mybucket-yoramk', 'mmm', 'm1.zip', 'module.zip', function(err, data){
// 	console.log(err);
// 	console.log(data);
// });