var config =  require('../config');
var logger  		= require('../logger');
var readlineSync    = require('readline-sync');
var infoHelper  		= require('../helpers/info.js');
var Errors  		= require('../errors');
var Messages  	= require('../messages');

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
            logger.debug.error(err);
            if (err.expected && err.message) {
                logger.error(err.message);
            }
            else {
                logger.error(Errors.General.Unexpected);
            }
            process.exit(1);
            }
        else {
            logger.log(JSON.stringify(response, null, 2));
            process.exit(0);
        }
    });
}

function collectOptions(options){
	// interact and collect module details
    
    if(!options.module){
	    logger.log('Please provide the module name, in order to include it\n'.blue)
	        .log('Or you can complete the wizard below:\n');
	}

    options.module = options.module || readlineSync.question('module: '.grey);

    if (options.module.indexOf(ModuleNameVersionSeperator) > 0){
        var nameAndVersion = options.module.split(ModuleNameVersionSeperator);
        if (nameAndVersion.length != 2) {
            logger.error(Errors.Include.IllegalModuleNameAndVersion);
            process.exit(1);
        }

        options.module = nameAndVersion[0];

        if (options.version) {
            logger.error(Errors.Include.VersionConflict);
            process.exit(1);
        }
        else{
            options.version = nameAndVersion[1];
        }
    }
    else{
        options.version = options.version || readlineSync.question('version ($<defaultInput>):', {
            defaultInput: path.basename(Latest)
        }) || Latest;
    }
    
    delete options['_'];
	logger.debug.log(options);
}