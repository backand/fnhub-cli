var config =  require('../config');
var logger  		= require('../logger');
var addHelper  		= require('../helpers/add.js');
var async = require('async');
var	yaml = require('js-yaml');
var fs = require('fs');
var readlineSync    = require('readline-sync');

var Errors      = require('../errors');
var Messages  	= require('../messages');

function collectOptions(options, callback){
	//interact and collect function details

	if(!options.name || !options.handler || !options.runtime){
		logger.log('Please provide the function name, the function handler, the runtime, and optionally the environment variables, in order to add it\n'.blue)
			.log('Or you can complete the wizard below:\n');			
	}

	try {
	  var doc = yaml.safeLoad(fs.readFileSync(config.templates.module, 'utf8'));
	} 
	catch (e) {
	  logger.error('The ' + config.templates.module + ' file is damaged, cannot proceed.')
		logger.debug.error(e);
	  process.exit(1);
	}

	options.name = options.name || readlineSync.question('function name ($<defaultInput>): ', {
		defaultInput: doc.Metadata.Name 
	});
	if(!options.name || options.name.length === 0){
		logger.warn('Function name is required');
		options.name = readlineSync.question('function name: ');
		if(!options.name){
			logger.warn('Must enter a function name');
			process.exit(1);
		}
	}

	options.description = options.description || readlineSync.question('function description ($<defaultInput>): ', {
		defaultInput: doc.Description 
	});
	if(!options.description || options.description.length === 0){
		logger.warn('Function description is required');
		options.description = readlineSync.question('function description: ');
		if(!options.description){
			logger.warn('Must enter a function description');
			process.exit(1);
		}
	}
  
	if (!options.runtime){
		var runtime = config.aws.runtime; 
		index = readlineSync.keyInSelect(runtime, 'Select runtime to use? ', {cancel: false});
		logger.debug.log(runtime[index] + ' is enabled.');
		options.runtime = runtime[index];
	}

	//get default 
	if(!options.handler) {
		var defaultHandler = config.aws.defaultHandler;
		options.handler = readlineSync.question('function handler ($<defaultInput>): ',{
			defaultInput: defaultHandler[index]
		});
	}

	if(!options.env){ //only ask if the object was not provided
		options.env = readlineSync.question('environment variables (optional): ');
		try{
			if(options.env) {
				options.env = JSON.parse(options.env);
			}
		}
		catch(e){
			logger.warn('Environment Variables should be a valid JSON');
			process.exit(1);
		}
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