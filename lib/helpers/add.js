var	yaml 					= require('js-yaml');
var fs 						= require('fs');
var async 				= require('async');
var _ 						= require('lodash');
var validate 			= require('./validate');
var printErrors 	= require('./print-errors-array');

module.exports = function(options, fnhub, callback){

	try {
	  var doc = yaml.safeLoad(fs.readFileSync(fnhub.config.templates.module, 'utf8'));
	} 
	catch (e) {
	  fnhub.logger.error('The ' + fnhub.config.templates.module + ' file is damaged, cannot proceed.')
	  process.exit(1);
	}

	try {
	  var functionJson = yaml.safeLoad(fs.readFileSync(__dirname + '/../templates/' + fnhub.config.templates.function, 'utf8'));
	} 
	catch (e) {
	  fnhub.logger.error('Internal error cannot proceed.');
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

	fnhub.logger.debug.log(functionJson);
	doc.Resources[options.name] = functionJson;
	
	// validate doc
	var validationResult = validate(doc, false);
	if (validationResult.flag){
		fnhub.logger.error('The ' + fnhub.config.templates.module + ' file is wrong, please correct the following:');
		printErrors(validationResult.errors, "message");
		process.exit(1);
	}

	var schema = yaml.safeDump(doc, {});
	try {
		// write back module.yaml
		fs.writeFileSync(fnhub.config.templates.module, schema);
		callback(null, { data: {}});
	}
	catch (e) {
	  logger.error('Cannot write ' + fnhub.config.templates.module);
	  process.exit(1);
	}
};