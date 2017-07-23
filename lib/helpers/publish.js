var _               = require('lodash');
var backand         = require('@backand/nodejs-sdk');
var async           = require('async');
var yaml            = require('js-yaml');
var fs              = require('fs');

var upload          = require('./upload');
var git             = require('./git');
var zipDirectory    = require('./zip-things').zipDirectory;
var validate        = require('./validate');
var printErrors     = require('./print-errors-array');

var fnhub 		    = require('../fnhub');

var publishLambda = {
    name:'publish',
    start:'start',
    end:'end'
}
var NotAnUpgradeError = 'The new version is not an upgrade';

module.exports.publish = publish;

function getModuleFile(callback){
    // Get document, or throw exception on error 
    fnhub.logger.log(fnhub.resources.Messages.Publish.StartValidation);
    try {
        var moduleJson = yaml.safeLoad(fs.readFileSync(fnhub.config.templates.module, 'utf8'));
        callback(null, moduleJson);
    } catch (e) {
        fnhub.logger.debug.error(e);
        callback(e, null);
    }
   
}

function validateYaml(moduleJson, callback){
    var validationResult = validate(moduleJson, false);
	if (validationResult.flag){
		fnhub.logger.error('The ' + fnhub.config.templates.module + ' file is wrong, please correct the following:');
        printErrors(validationResult.errors, "message");
		process.exit(1);
	}
    callback(null, moduleJson);
}

function validateGit(moduleJson, callback){
    var destFolder = process.cwd();
    if (fnhub.config.git.forceCommit) {
        git.isOkStatus(destFolder, function(err, data){
            if (err){
                callback(err, null);
            }
            else {
                fnhub.logger.success(fnhub.resources.Messages.Publish.EndValidation);
                callback(null, moduleJson);
            }
        })
    }
    else {
        fnhub.logger.success(fnhub.resources.Messages.Publish.EndValidation);
        callback(null, moduleJson);
    }
}


function startPublish(moduleJson, callback){
    fnhub.logger.log(fnhub.resources.Messages.Publish.StartRepositoryChecking);
    var name = moduleJson.Metadata.Name;
    var version = moduleJson.Metadata.Version;
    var githubRepo = moduleJson.Metadata.Repo;
    var keywords = null;
    if (moduleJson.Metadata.Keywords)
        keywords = moduleJson.Metadata.Keywords;
    var language = 'node';
    
    backand.fn.post(publishLambda.name, {name:name, version:version, githubRepo:githubRepo, keywords:keywords, language:language, status:publishLambda.start})
    .then(function(response){
        var version = response.data.version;
        var temporaryRole = response.data.temporaryRole;
        fnhub.logger.debug.log(temporaryRole);
        var codeUri = response.data.version.host + response.data.version.folder + '/' + response.data.version.code;
        fnhub.logger.success(fnhub.resources.Messages.Publish.EndRepositoryChecking);
        callback(null, moduleJson, version, temporaryRole, codeUri)
    })
    .catch(function(err){
        if (err.data.errorMessage == NotAnUpgradeError){
            callback({message: fnhub.resources.Errors.Publish.NotAnUpgradeError, expected:true}, null);
        }
        else callback(err, null);
    });
}

function deleteZip(fileName){
    var fullPath = require('path').join(process.cwd(), fileName);
    if (fs.existsSync(fileName))
        fs.unlinkSync(fileName)
}

function zip(moduleJson, version, temporaryRole, codeUri, callback){
    fnhub.logger.log(fnhub.resources.Messages.Publish.StartZip);
    deleteZip(fnhub.config.codeZipFileName);
    zipDirectory(process.cwd(), fnhub.config.codeZipFileName, function(err, data){
        if (err) callback(err, null);
        else {
            fnhub.logger.success(fnhub.resources.Messages.Publish.EndZip);
            callback(null, moduleJson, version, temporaryRole, codeUri);
        }
    });
    //callback(null, moduleJson, version, temporaryRole, codeUri);
    
}

function updateLinkToCode(moduleJson, version, temporaryRole, codeUri, callback){
    fnhub.logger.log(fnhub.resources.Messages.Publish.StartUpload);

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
    fs.writeFileSync(fnhub.config.templates.module, s);
		
    if (fnhub.config.git.forceCommit) {
        var msg = 'new module version';
        var destFolder = process.cwd();
        git.commit(msg, destFolder, function(err, stdout, stderr) {
            if (err && !stdout.indexOf('Your branch is up-to-date') && !stdout.indexOf('nothing to commit, working tree clean')) {
                callback({err:err, stdout:stdout, stderr:stderr}, null);
            }
            else callback(null, version, temporaryRole, codeUri);
        });
    }
    else {
        callback(null, version, temporaryRole, codeUri);
    }
}

function uploadCodeToS3(version, temporaryRole, codeUri, callback){
    var target = version.code;
    var source = fnhub.config.codeZipFileName;
    uploadToS3(source, target, version, temporaryRole, codeUri, callback);
}

function uploadYamlToS3(version, temporaryRole, codeUri, callback){
    var target = version.deployment;
    var source = fnhub.config.yamlFileName;
    uploadToS3(source, target, version, temporaryRole, codeUri, callback);
}

function uploadToS3(source, target, version, temporaryRole, codeUri, callback){
    var credentials = temporaryRole;
    var bucket = version.bucket;
    var folder = version.folder;
    upload.upload(credentials, bucket, folder, target, source, function(err) {
        if (err)
            callback(err, null);
        else
            callback(null, version, temporaryRole, codeUri);
    });
    
}

function endPublish(version, temporaryRole, codeUri, callback){
    
    deleteZip(fnhub.config.codeZipFileName);
    backand.fn.post(publishLambda.name, {versionId:version.__metadata.id, status:publishLambda.end})
    .then(function(response){
        fnhub.logger.success(fnhub.resources.Messages.Publish.EndUpload);
        callback(null, {codeUri: codeUri});
    })
    .catch(function(err){
        callback(err, null);
    });
}


function publish(callback){
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