var backand = require('@backand/nodejs-sdk');
var async = require('async');

module.exports.publish = publish;
var args;

function initFlow(callback){
    callback(null);
}

function getModuleFile(callback){
    callback(null, {});
}

function validate(callback){
    callback(null, {});
}

function updateLinkToCode(callback){
    callback(null, {});
}

function startPublish(callback){
    backand.fn.post("publish", {name:args.name, version:args.version, status:'start'})
    .then(function(response){
        callback(null, response.data.version.__metadata.id)
    })
    .catch(function(err){
        callback(err, null);
    });
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


function publish(name, version, publishCallback){
    args = {name:name, version:version};
    async.waterfall([
        initFlow,
        getModuleFile,
        startPublish,
        uploadToS3,
        endPublish,
    ], publishCallback);
}