var backand = require('@backand/nodejs-sdk');
var async = require('async');
yaml = require('js-yaml');
fs   = require('fs');

module.exports.publish = publish;

function getModuleFile(callback){
    // Get document, or throw exception on error 
    try {
        var module = yaml.safeLoad(fs.readFileSync('module.yaml', 'utf8'));
        callback(null, module);
    } catch (e) {
        callback(e, null);
    }
   
}

function validate(module, callback){
    callback(null, module);
}

function startPublish(module, callback){
    var name = module.Metadata.Name;
    var version = module.Metadata.Version;
    var githubRepo = module.Metadata.Repo;
    
    backand.fn.post("publish", {name:name, version:version, githubRepo:githubRepo, status:'start'})
    .then(function(response){
        var versionId = response.data.version.__metadata.id;
        var codeUri = response.data.version.host + response.data.version.code;
        callback(null, module, versionId, codeUri)
    })
    .catch(function(err){
        callback(err, null);
    });
}

function updateLinkToCode(module, versionId, codeUri, callback){
    try {
        // var s = yaml.safeDump(module, {});
        // fs.writeFileSync('module.yaml', s);
        callback(null, versionId);
    } catch (e) {
        callback(e, null);
    }
}

function uploadToS3(versionId, callback){
    callback(null, versionId);
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