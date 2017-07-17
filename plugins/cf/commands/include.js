var cf = require('../index');
var fs = require('fs');
var includeHelper = require('../helpers/include');

module.exports = function(options, fnhub){
	// interact and collect function details
    if (!options){
        options = {};
    }
    
    collectOptions(options, fnhub);

    includeHelper.include(options, fnhub, function(err, response){
        if (err) {
            fnhub.logger.debug.error(err);
            if (err.expected && err.message) {
                fnhub.logger.error(err.message);
            }
            else {
                fnhub.logger.error(fnhub.Errors.General.Unexpected);
            }
            process.exit(1);
            }
        else {
            fnhub.logger.success(cf.Messages.Include.AfterSuccess.replace('{{0}}', response.stackFileName));
            process.exit(0);
        }
    });
}

function collectOptions(options, fnhub){
	// interact and collect module details
    
    if(!options.module){
	    fnhub.logger.log('Please provide the module name, in order to include it\n'.blue)
	        .log('Or you can complete the wizard below:\n');
	}

    options.module = options.module || fnhub.readlineSync.question('module: '.grey);

    if (options.module.indexOf(fnhub.Consts.Version.ModuleSeperator) > 0){
        var nameAndVersion = options.module.split(fnhub.Consts.Version.ModuleSeperator);
        if (nameAndVersion.length != 2) {
            fnhub.logger.error(fnhub.Errors.Include.IllegalModuleNameAndVersion);
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
        options.version = options.version || fnhub.readlineSync.question('version ($<defaultInput>):', {
            defaultInput: fnhub.Consts.Version.Latest
        }) || fnhub.Consts.Version.Latest;
    }
    
    delete options['_'];
	fnhub.logger.debug.log(options);
}

