var _               = require('lodash');
var backand         = require('@backand/nodejs-sdk');
var async           = require('async');
var yaml            = require('js-yaml');
var fs              = require('fs');
var fnhub 			= require('../fnhub');

var deleteLambda = {
    name:'publish',
    delete:'delete'
}
var NotAnUpgradeError = 'The new version is not an upgrade';

module.exports.delete = deleteModule;

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

function getModuleName(moduleJson, callback){
    // Get document, or throw exception on error 
    callback(null, moduleJson.Metadata.Name);
}

function startDelete(moduleName, callback){
    
    backand.fn.post(deleteLambda.name, {name:moduleName, status:deleteLambda.delete})
    .then(function(response){
        callback(null, {moduleName:moduleName});
    })
    .catch(function(err){
        callback(err, null);
    });
}

function deleteModule(callback){
    async.waterfall([
        getModuleFile,
        getModuleName,
        startDelete,
    ], callback);
}