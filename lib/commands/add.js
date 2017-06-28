var backand = require('@backand/nodejs-sdk')
var config =  require('../config');
var logger  		= require('../logger');
var question    = require('readline-sync').question;
var addHelper  		= require('../helpers/add.js');

module.exports = function(options){
	// interact and collect function details

	if(!options.name || !option.handler || !options.runtime){
	    logger.log('Please provide the function name, the function handler, the runtime, and optionally the environment variables, in order to add it\n'.blue)
	        .log('Or you can complete the wizard below:\n');
	}
	options.name = options.name || question('Function name: '.grey);
	options.handler = options.handler || question('Handler function: '.grey);
	
	nodejsRuntimes = ['nodejs6.10', 'nodejs4.3'];
	index = readlineSync.keyInSelect(nodejsRuntimes, 'Which Node.js runtime to use?');
	console.log(nodejsRuntimes[index] + ' is enabled.');
	var runtime = nodejsRuntimes[index];

	var envVars = options.env;
	if(!options.envVars){ //only ask if the object was not provided
		options.envVars = question('Environment variables (optional): '.grey);
	}

	try{
	    envVars = JSON.parse(envVars);
	}
	catch(e){
	    logger.warn('Environment Variables should be a valid JSON');
	    process.exit(1);
	}

	addHelper(options.name, options.handler, runtime, envVars, function(err, response){
		if (err) console.error(err);
		else console.log('Function added', response.data);
	});
}