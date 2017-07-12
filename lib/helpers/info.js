var request = require('request');
var async = require('async');
var config =  require('../config');
var	yaml = require('js-yaml');

function requestModule(module, version, callback){
    var options = { method: 'GET',
        url: config.aws.s3.host + config.aws.s3.bucket + '/' + module + '/module@' + version + '.yaml'
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
