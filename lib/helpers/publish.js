var config = require('../config');
var backand = require('@backand/nodejs-sdk');
var async = require('async');
var yaml = require('js-yaml');
var fs   = require('fs');
var upload = require('./upload')

module.exports.publish = publish;

function getModuleFile(callback){
    // Get document, or throw exception on error 
    try {
        var moduleJson = yaml.safeLoad(fs.readFileSync(config.templates.module, 'utf8'));
        callback(null, moduleJson);
    } catch (e) {
        callback(e, null);
    }
   
}

function validate(moduleJson, callback){
    callback(null, moduleJson);
}

function startPublish(moduleJson, callback){
    var name = moduleJson.Metadata.Name;
    var version = moduleJson.Metadata.Version;
    var githubRepo = moduleJson.Metadata.Repo;
    
    backand.fn.post("publish", {name:name, version:version, githubRepo:githubRepo, status:'start'})
    .then(function(response){
        console.log("publish response", JSON.stringify(response.data.temporaryRole))
        var versionId = response.data.version.__metadata.id;
        var codeUri = 'aa';//response.data.version.host + response.data.version.code;
        callback(null, moduleJson, versionId, codeUri)
    })
    .catch(function(err){
        callback(err, null);
    });
}

function updateLinkToCode(moduleJson, versionId, codeUri, callback){
    try {
        // var s = yaml.safeDump(moduleJson, {});
        // fs.writeFileSync(config.templates.module, s);
        callback(null, versionId);
    } catch (e) {
        callback(e, null);
    }
}

function uploadToS3(versionId, callback){
    try {
        //upload(credentials, bucket, folder, zipFileName, zipFile, (err) => callback(null, versionId));
        callback(null, versionId);
    } catch (e) {
        callback(e, null);
    }
}

function endPublish(versionId, callback){
    backand.fn.post("publish", {versionId:versionId, status:'end'})
    .then(function(response){
        callback(null, response)
    })
    .catch(function(err){
        callback(err, null);
    });
}


function publish(publishCallback){
    async.waterfall([
        getModuleFile,
        startPublish,
        updateLinkToCode,
        uploadToS3,
        endPublish,
    ], publishCallback);
}