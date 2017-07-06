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
    logger.debug.log('getModuleFile');
    try {
        var moduleJson = yaml.safeLoad(fs.readFileSync(config.templates.module, 'utf8'));
        callback(null, moduleJson);
    } catch (e) {
        logger.debug.log(e);
        callback(e, null);
    }
   
}

function validateYaml(moduleJson, callback){
    logger.debug.log('validateYaml with moduleJson and true');
    callback(null, moduleJson);
}

function validateGit(moduleJson, callback){
    var destFolder = process.cwd();
    if (config.git.forceCommit) {
        git.isOkStatus(destFolder, function(err, data){
            if (err){
                callback(err, null);
            }
            else {
                callback(null, moduleJson);
            }
        })
    }
    else {
        callback(null, moduleJson);
    }
}


function startPublish(moduleJson, callback){
    logger.debug.log('startPublish');
    var name = moduleJson.Metadata.Name;
    var version = moduleJson.Metadata.Version;
    var githubRepo = moduleJson.Metadata.Repo;
    var keywords = null;
    if (moduleJson.Metadata.Keywords)
        keywords = moduleJson.Metadata.Keywords;
    var language = 'node';
    
    backand.fn.post(publishLambda.name, {name:name, version:version, githubRepo:githubRepo, keywords:keywords, language:language, status:publishLambda.start})
    .then(function(response){
        logger.debug.log("publish response", response.data)
        var version = response.data.version;
        var temporaryRole = response.data.temporaryRole;
        logger.debug.log(temporaryRole);
        var codeUri = response.data.version.host + response.data.version.code;
        callback(null, moduleJson, version, temporaryRole, codeUri)
    })
    .catch(function(err){
        logger.debug.log('startPublish err', err);
        callback(err, null);
    });
}

function deleteZip(fileName){
    var fullPath = require('path').join(process.cwd(), fileName);
    if (fs.existsSync(fileName))
        fs.unlinkSync(fileName)
}

function zip(moduleJson, version, temporaryRole, codeUri, callback){
    logger.debug.log('zip');
    deleteZip(config.codeZipFileName);
    zipDirectory(process.cwd(), config.codeZipFileName, function(err, data){
        if (err) callback(err, null);
        else callback(null, moduleJson, version, temporaryRole, codeUri);
    });
    //callback(null, moduleJson, version, temporaryRole, codeUri);
    
}

function updateLinkToCode(moduleJson, version, temporaryRole, codeUri, callback){
    logger.debug.log('updateLinkToCode');

    if (moduleJson.Resources){
        for (var property in moduleJson.Resources) {
            if (moduleJson.Resources.hasOwnProperty(property)) {
                if (moduleJson.Resources[property].Properties){
                    moduleJson.Resources[property].Properties.CodeUri = codeUri;
                }
            }
        }
    }
    
    var s = yaml.safeDump(moduleJson, {});
    fs.writeFileSync(config.templates.module, s);
		
    if (config.git.forceCommit) {
        var msg = 'new module version';
        git.commit(msg, function(err, stdout, stderr) {
            if (err) callback(err, null);
            else callback(null, version, temporaryRole);
        });
    }
    else {
        callback(null, version, temporaryRole);
    }
}

function uploadCodeToS3(version, temporaryRole, callback){
    logger.debug.log('uploadCodeToS3');
    var target = version.code;
    var source = config.codeZipFileName;
    uploadToS3(source, target, version, temporaryRole, callback);
}

function uploadYamlToS3(version, temporaryRole, callback){
    logger.debug.log('uploadYamlToS3');
    var target = version.deployment;
    var source = config.yamlFileName;
    uploadToS3(source, target, version, temporaryRole, callback);
}

function uploadToS3(source, target, version, temporaryRole, callback){
    var credentials = temporaryRole;
    var bucket = version.bucket;
    var folder = version.folder;
    upload.upload(credentials, bucket, folder, target, source, function(err) {
        if (err)
            callback(err, null);
        else
            callback(null, version, temporaryRole);
    });
    
}

function endPublish(version, temporaryRole, callback){
    logger.debug.log('endPublish');
    deleteZip(config.codeZipFileName);
    backand.fn.post(publishLambda.name, {versionId:version.__metadata.id, status:publishLambda.end})
    .then(function(response){
        callback(null, response)
    })
    .catch(function(err){
        callback(err, null);
    });
}


function publish(callback){
    logger.debug.log('publish');
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