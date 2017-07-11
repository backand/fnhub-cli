var backand = require('@backand/nodejs-sdk')
var config =  require('../config');
var logger  		= require('../logger');
var providers  		= require('../providers');
var createHelper  = require('../helpers/create.js');
var readlineSync    = require('readline-sync');
var _ = require('lodash');
var path = require('path');
var Errors  		= require('../errors');
var Messages  	= require('../messages');

function buildQuestion(text, defaultValue){
	return text + '(' + defaultValue + '):';
}

module.exports = function(options){
    if (!options){
        options = {};
    }
    
    collectOptions(options);

    createHelper.create(options, function(err, response){
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
            logger.success(Messages.Create[options.provider].AfterSuccess.replace('{{0}}', response.templateName));
            process.exit(0);
        }
    });
	
}

function collectOptions(options){
	// interact and collect module details
    options.provider = options.provider || readlineSync.question('cloud provider ($<defaultInput>):', {
		defaultInput: providers.aws
	}) || providers.aws;

	options.name = options.name || readlineSync.question('name ($<defaultInput>):', {
		defaultInput: path.basename(process.cwd())
	}) || path.basename(process.cwd());

    options.description = options.description || readlineSync.question('description:');

	delete options['_'];
	logger.debug.log(options);
   
}