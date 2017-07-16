var cf = require('../index');
var fs = require('fs');
var path = require('path');
var createHelper = require('../helpers/create');

module.exports = function(options, fnhub){
    console.log('create');
    if (!options){
        options = {};
    }
    
    collectOptions(options, fnhub);

    createHelper.create(options, fnhub, function(err, response){
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
            fnhub.logger.success(cf.Messages.Create.AfterSuccess.replace('{{0}}', response.stackFileName));
            process.exit(0);
        }
    });
	
}

function collectOptions(options, fnhub){
	// interact and collect module details
    options.name = options.name || fnhub.readlineSync.question('stack name ($<defaultInput>):', {
		defaultInput: path.basename(process.cwd())
	}) || path.basename(process.cwd());

    options.description = options.description || fnhub.readlineSync.question('description:');

	delete options['_'];
	fnhub.logger.debug.log(options);
   
}


