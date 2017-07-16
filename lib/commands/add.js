var config =  require('../config');
var logger  		= require('../logger');
var readlineSync    = require('readline-sync');
var addHelper  		= require('../helpers/add.js');
	
module.exports = function(options){
	// interact and collect function details

	if(!options.name || !options.handler || !options.runtime){
	    logger.log('Please provide the function name, the function handler, the runtime, and optionally the environment variables, in order to add it\n'.blue)
	        .log('Or you can complete the wizard below:\n');
	}
	options.name = options.name || readlineSync.question('function name: '.grey);
	options.handler = options.handler || readlineSync.question('handler function: '.grey);
	
	if (!options.runtime){
		nodejsRuntimes = config.nodeRuntimes;
		index = readlineSync.keyInSelect(nodejsRuntimes, 'node.js runtime to use?');
		console.log(nodejsRuntimes[index] + ' is enabled.');
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

	addHelper(options.name, options.handler, options.runtime, options.env, function(err, response){
		if (err) {
			logger.error(err);
			process.exit(1);
		}
		else {
			logger.success('Function added', response.data);
			process.exit(0);
		}
	});
}