var	yaml = require('js-yaml');
var fs = require('fs');
var validate = require('./validate');
var async = require('async');
var _ = require('lodash');
var config = require('../config');
var printErrors = require('./print-errors-array');
var logger = require('../logger');

module.exports = function(options, callback){

	try {
	  var doc = yaml.safeLoad(fs.readFileSync(config.templates.module, 'utf8'));
	} 
	catch (e) {
	  logger.error('The ' + config.templates.module + ' file is damaged, cannot proceed.')
	  process.exit(1);
	}

	try {
	  var functionJson = yaml.safeLoad(fs.readFileSync(__dirname + '/../templates/' + config.templates.function, 'utf8'));
	} 
	catch (e) {
	  logger.error('Internal error cannot proceed.');
	  process.exit(1);
	}

	functionJson.Properties.Description = options.description;
	functionJson.Properties.Handler = options.handler;
	functionJson.Properties.Runtime = options.runtime;

	if(options.env && options.env != {} && options.env != "{}"){
		functionJson.Properties.Environment.Variables = options.env;
	} else {
		delete functionJson.Properties.Environment;
	}

	// fill it with function details
	if (!doc.Resources){
		doc.Resources = {};
	}

	logger.debug.log(functionJson);
	doc.Resources[options.name] = functionJson;
	
	// validate doc
	var validationResult = validate(doc, false);
	if (validationResult.flag){
		logger.error('The ' + config.templates.module + ' file is wrong, please correct the following:');
		printErrors(validationResult.errors, "message");
		process.exit(1);
	}

	var schema = yaml.safeDump(doc, {});
	try {
		// write back module.yaml
		fs.writeFileSync(config.templates.module, schema);
		callback(null, { data: {}});
	}
	catch (e) {
	  logger.error('Cannot write ' + config.templates.module);
	  process.exit(1);
	}
};