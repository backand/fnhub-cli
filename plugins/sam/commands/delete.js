var cf = require('../index');
var fs = require('fs');
var path = require('path');
var deleteHelper = require('../helpers/delete');

module.exports = function(options, fnhub){
    console.log('delete');
    if (!options){
        options = {};
    }
    
    var stack = cf.getStack(fnhub);
    
    collectOptions(options, stack, fnhub);

    deleteHelper.deleteStack(options, fnhub, stack, function(err, response){
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
            fnhub.logger.success(cf.Messages.Delete.AfterSuccess,options.name);
            process.exit(0);
        }
    });
	
}

function collectOptions(options, stack, fnhub){
	var stackNameFromFile = getStackName(stack);
    if (stackNameFromFile && options.name && stackNameFromFile != options.name) {
        fnhub.logger.warn('The stack name you provided is different than the existing stack name in the ' + cf.getStackFileName());
        process.exit(1);
    }


    options.name = options.name || stackNameFromFile || fnhub.readlineSync.question('stack name ($<defaultInput>):', {
		defaultInput: path.basename(process.cwd())
	}) || path.basename(process.cwd());

    delete options['_'];
	fnhub.logger.debug.log(options);
   
}

function getStackName(stack){
    if (!stack || !stack.Metadata) return null;
    else return stack.Metadata.Name;
}


