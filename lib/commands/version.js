var question            = require('readline-sync').question;
var versionHelper  		= require('../helpers/version.js');

module.exports = function (options, fnhub) {
    var generalError = "fnhub version [<newversion> | major | minor | patch]";
    var levels = {
        major: "major",
        minor: "minor",
        patch: "patch"
    };
    
    var logResponse = function(err, data) {
        fnhub.logger.newline();

        if (err) {
            fnhub.logger.error(err);
            process.exit(1);
        }
        else {
            fnhub.logger.success(data.Metadata.Name + ', version: ' + data.Metadata.Version);
            process.exit(0);
        }
    }

    if (options._.length == 1) {
        versionHelper.get(fnhub, logResponse);
    }    
    else if (options._.length == 2) {
        var level = options._[1];
        if (level == levels.major){
            versionHelper.major(fnhub, logResponse);
        }
        else if (level == levels.minor){
            versionHelper.minor(fnhub, logResponse);
        }
        else if (level == levels.patch){
            versionHelper.patch(fnhub, logResponse);
        }
        else {
            fnhub.logger.error(generalError);
            process.exit(1);
        }
    }
    else {
        fnhub.logger.error(generalError);
        process.exit(1);
    }
};