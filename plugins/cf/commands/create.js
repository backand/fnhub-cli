var fs              = require('fs');
var path            = require('path');
var createHelper    = require('../helpers/create');
var cf              = require('../index');

module.exports = function(options, fnhub){
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
                fnhub.logger.error(fnhub.resources.Errors.General.Unexpected);
            }
            process.exit(1);
            }
        else {
            fnhub.logger.success(cf.Messages.Create.AfterSuccess,response.stackFileName);
            process.exit(0);
        }
    });
	
}

function collectOptions(options, fnhub){
	// interact and collect module details
    options.name = options.name || fnhub.readlineSync.question(fnhub.resources.Questions.Cf.Create.Name, {
		defaultInput: path.basename(process.cwd())
	}) || path.basename(process.cwd());

    options.description = options.description || fnhub.readlineSync.question(fnhub.resources.Questions.Cf.Create.Description);

	delete options['_'];
	fnhub.logger.debug.log(options);
   
}


