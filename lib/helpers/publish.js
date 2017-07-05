var config = require('../config');
var backand = require('@backand/nodejs-sdk');
var async = require('async');
var yaml = require('js-yaml');
var fs   = require('fs');
var upload = require('./upload');
var git = require('./git');
var zipDirectory = require('./zip-things').zipDirectory;

const publishLambda = {
    name:'publish',
    start:'start',
    end:'end'
}

module.exports.publish = publish;

function getModuleFile(callback){
    // Get document, or throw exception on error 
    console.log('getModuleFile');
    try {
        var moduleJson = yaml.safeLoad(fs.readFileSync(config.templates.module, 'utf8'));
        callback(null, moduleJson);
    } catch (e) {
        console.log(e);
        callback(e, null);
    }
   
}

function validateYaml(moduleJson, callback){
    console.log('validateYaml with moduleJson and true');
    callback(null, moduleJson);
}

function validateGit(moduleJson, callback){
    var destFolder = process.cwd();
    git.isOkStatus(destFolder, function(err, data){
        if (err){
            callback(err, null);
        }
        else {
            callback(null, moduleJson);
        }
    })
    //callback(null, moduleJson);
}


function startPublish(moduleJson, callback){
    console.log('startPublish');
    var name = moduleJson.Metadata.Name;
    var version = moduleJson.Metadata.Version;
    var githubRepo = moduleJson.Metadata.Repo;
    var keywords = null;
    if (moduleJson.Metadata.Keywords)
        keywords = moduleJson.Metadata.Keywords;
    var language = 'node';
    
    backand.fn.post(publishLambda.name, {name:name, version:version, githubRepo:githubRepo, keywords:keywords, language:language, status:publishLambda.start})
    .then(function(response){
        console.log("publish response", JSON.stringify(response.data))
        var version = response.data.version;
        var temporaryRole = response.data.temporaryRole;
        console.log(temporaryRole);
        var codeUri = response.data.version.host + response.data.version.code;
        callback(null, moduleJson, version, temporaryRole, codeUri)
    })
    .catch(function(err){
        console.log('startPublish err', err);
        callback(err, null);
    });
}

function deleteZip(fileName){
    var fullPath = require('path').join(process.cwd(), fileName);
    if (fs.existsSync(fileName))
        fs.unlinkSync(fileName)
}

function zip(moduleJson, version, temporaryRole, codeUri, callback){
    console.log('zip');
    deleteZip(config.codeZipFileName);
    zipDirectory(process.cwd(), config.codeZipFileName, function(err, data){
        if (err) callback(err, null);
        else callback(null, moduleJson, version, temporaryRole, codeUri);
    });
    //callback(null, moduleJson, version, temporaryRole, codeUri);
    
}

function updateLinkToCode(moduleJson, version, temporaryRole, codeUri, callback){
    console.log('updateLinkToCode');
    callback(null, version, temporaryRole);
}

function uploadCodeToS3(version, temporaryRole, callback){
    console.log('uploadCodeToS3');
    var target = version.code;
    var source = config.codeZipFileName;
    uploadToS3(source, target, version, temporaryRole, callback);
}

function uploadYamlToS3(version, temporaryRole, callback){
    console.log('uploadYamlToS3');
    var target = version.deployment;
    var source = config.yamlFileName;
    uploadToS3(source, target, version, temporaryRole, callback);
}

function uploadToS3(source, target, version, temporaryRole, callback){
    console.log('uploadYamlToS3')
    var credentials = temporaryRole;
    var bucket = version.bucket;
    var folder = version.folder;
    upload.upload(credentials, bucket, folder, target, source, function(err) {
        deleteZip(config.codeZipFileName);
        if (err)
            callback(err, null);
        else
            callback(null, version, temporaryRole);
    });
    
}

function endPublish(version, temporaryRole, callback){
    console.log('endPublish');
    backand.fn.post(publishLambda.name, {versionId:version.__metadata.id, status:publishLambda.end})
    .then(function(response){
        callback(null, response)
    })
    .catch(function(err){
        callback(err, null);
    });
}


function publish(callback){
    console.log('publish');
    async.waterfall([
        getModuleFile,
        validateYaml,
        validateGit,
        startPublish,
        zip,
        updateLinkToCode,
        uploadYamlToS3,
        uploadCodeToS3,
        endPublish,
    ], callback);
}