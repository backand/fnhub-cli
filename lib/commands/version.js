"use strict";

var config =  require('../config');
var logger  		= require('../logger');
var question    = require('readline-sync').question;
var versionHelper  		= require('../helpers/version.js');

module.exports = function (options) {
    var generalError = "fnhub version [<newversion> | major | minor | patch]";
    var levels = {
        major: "major",
        minor: "minor",
        patch: "patch"
    };
    
    var logResponse = function(err, data) {
        logger.newline();

        if (err) {
            logger.error(err);
            process.exit(1);
        }
        else {
            logger.success(data.Metadata.Name + ', version: ' + data.Metadata.Version);
            process.exit(0);
        }
    }

    if (options._.length == 1) {
        versionHelper.get(logResponse);
    }    
    else if (options._.length == 2) {
        var level = options._[1];
        if (level == levels.major){
            versionHelper.major(logResponse);
        }
        else if (level == levels.minor){
            versionHelper.minor(logResponse);
        }
        else if (level == levels.patch){
            versionHelper.patch(logResponse);
        }
        else {
            logger.error(generalError);
            process.exit(1);
        }
    }
    else {
        logger.error(generalError);
        process.exit(1);
    }
};