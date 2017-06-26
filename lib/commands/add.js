var backand = require('@backand/nodejs-sdk')
var config =  require('../config');
var logger  		= require('../logger');
var question    = require('readline-sync').question;
var addHelper  		= require('../helpers/add.js');

module.exports = function(options){
	// interact and collect function details

	if(!options.name || !option.handler){
	    logger.log('Please provide the function name, the function handler, and optionally the environment variables, in order to add it\n'.blue)
	        .log('Or you can complete the wizard below:\n');
	}
	options.name = options.name || question('Function name: '.grey);
	options.name = options.name || question('Function name: '.grey);
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

	addHelper(options.name, options.handler, options.envVars, function(err, response){
		if (err) console.error(err);
		else console.log('Function added', response.data);
	});
}