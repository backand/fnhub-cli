var readlineSync    = require('readline-sync');
var path 			= require('path');
var infoHelper  	= require('../helpers/info.js');
var fnhub 			= require('../fnhub');

const Latest = 'latest';
const ModuleNameVersionSeperator = '@';
	
module.exports = function(options){
	// interact and collect function details
    if (!options){
        options = {};
    }
    
    collectOptions(options);

    infoHelper.getModule(options.module, options.version, function(err, response){
        if (err) {
            fnhub.logger.debug.error(err);
            if (err.expected && err.message) {
                fnhub.logger.error(err.message);
            }
            else {
                fnhub.logger.error(fnhub.resources.Errors.General.Unexpected);
            }
            process.exit(1);
            }
        else {
            fnhub.logger.log(JSON.stringify(response, null, 2));
            process.exit(0);
        }
    });
}

function collectOptions(options){
	// interact and collect module details
    
    if(!options.module){
	    fnhub.logger.log(fnhub.resources.Messages.Info.Instructions);
	}

    options.module = options.module || readlineSync.question(fnhub.resources.Questions.Info.Module);

    if (options.module.indexOf(ModuleNameVersionSeperator) > 0){
        var nameAndVersion = options.module.split(ModuleNameVersionSeperator);
        if (nameAndVersion.length != 2) {
            fnhub.logger.error(Errors.Include.IllegalModuleNameAndVersion);
            process.exit(1);
        }

        options.module = nameAndVersion[0];

        if (options.version) {
            fnhub.logger.error(Errors.Include.VersionConflict);
            process.exit(1);
        }
        else{
            options.version = nameAndVersion[1];
        }
    }
    else{
        options.version = options.version || readlineSync.question(fnhub.resources.Questions.Info.Version, {
            defaultInput: path.basename(Latest)
        }) || Latest;
    }
    
    delete options['_'];
	fnhub.logger.debug.log(options);
}