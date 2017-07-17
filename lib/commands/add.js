var config =  require('../config');
var logger  		= require('../logger');
var readlineSync    = require('readline-sync');
var addHelper  		= require('../helpers/add.js');
var async = require('async');

var Errors      = require('../errors');
var Messages  	= require('../messages');

function collectOptions(options, callback){
	// interact and collect function details

	if(!options.name || !options.handler || !options.runtime){
		logger.log('Please provide the function name, the function handler, the runtime, and optionally the environment variables, in order to add it\n'.blue)
			.log('Or you can complete the wizard below:\n');
	}
	options.name = options.name || readlineSync.question('function name: '.grey);
	if(!options.name){
		logger.warn('Function name is required');
		options.name = readlineSync.question('function name:');
		if(!options.name){
			logger.warn('Must enter a function name');
			process.exit(1);
		}
	}

	options.handler = options.handler || readlineSync.question('handler function: '.grey);
	
	if (!options.runtime){
		nodejsRuntimes = config.nodeRuntimes;
		index = readlineSync.keyInSelect(nodejsRuntimes, 'node.js runtime to use?');
		logger.debug.log(nodejsRuntimes[index] + ' is enabled.');
		options.runtime = nodejsRuntimes[index];
	}

	var envVars = options.env;
	if(!options.env){ //only ask if the object was not provided
		options.env = readlineSync.question('environment variables (optional): '.grey);
	}

	try{
	  if(options.env) {
			options.env = JSON.parse(options.env);
	  }
		else {
			options.env = null;
		}
	}
	catch(e){
		logger.warn('Environment Variables should be a valid JSON');
		process.exit(1);
	}

	delete options['_'];
	callback(null, options);
}

function results(options, callback){
	addHelper(options, function(err, response){
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
      logger.success(Messages.Function.AfterSuccess.replace('{{0}}', options.name));
      process.exit(0);
    }
	});
}

module.exports = function(options){
	async.waterfall([
		async.constant(options),
		collectOptions,
		results
	]);
}