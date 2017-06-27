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
        var version = response.data.version;
        var temporaryRole = response.data.temporaryRole;
        var codeUri = response.data.version.host + response.data.version.code;
        callback(null, moduleJson, version, temporaryRole, codeUri)
    })
    .catch(function(err){
        callback(err, null);
    });
}

function updateLinkToCode(moduleJson, version, temporaryRole, codeUri, callback){
    callback(null, version, temporaryRole);
}

function uploadToS3(version, temporaryRole, callback){
    var credentials = temporaryRole.Credentials;
    var bucket = version.bucket;
    var folder = version.folder;
    var zipFileName = version.code;
    var zipFile = config.codeZipFileName;
    upload.upload(credentials, bucket, folder, zipFileName, zipFile, (err) => {
        if (err)
            callback(err, null);
        else
            callback(null, version)
    });
    
}

function endPublish(version, callback){
    backand.fn.post("publish", {versionId:version.__metadata.id, status:'end'})
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