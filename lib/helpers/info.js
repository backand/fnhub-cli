var request     = require('request');
var async       = require('async');
var	yaml        = require('js-yaml');
var backand     = require('@backand/nodejs-sdk');

var fnhub 		= require('../fnhub');

function requestModule(module, version, callback){
    var options = { 
        method: 'GET',
        url: fnhub.config.aws.s3.host + fnhub.config.aws.s3.bucket + '/' + module + '/module@' + version + '.yaml'
    };

    request(options, function (error, response, body) {
        if (error) callback(error, null);
        else if (response.statusCode != 200) callback(response.body, null, null);
        else callback(null, body);
    });
}

function convertYamlToJson(yamlData, callback){
    var json = yaml.safeLoad(yamlData);
      
    callback(null, json);
}

module.exports.getModule = getModule;

function getModule(module, version, callback) {
    async.waterfall([
        async.constant(module, version),
        requestModule,
        convertYamlToJson
    ], callback);
}


module.exports.getCurrentUser = getCurrentUser;

function getCurrentUser(callback){
    backand.user.getUserDetails(false)
	.then(function(res) {
		if (res && res.data && res.data.username){
			callback(null, res.data)
		} else {
			callback('Current user was not found. Run signin command and try again.', null);
		}
	})
	.catch(function(err) {
		callback(null, options);
		fnhub.logger.debug.error(err);
	});
}