var	yaml = require('js-yaml');
var fs = require('fs');
var validate = require('./validate');
var async = require('async');
var _ = require('lodash');
var config = require('../config');
var printErrors = require('./print_errors_array');
var logger = require('../logger');

module.exports = function(functionName, functionHandler, runtime, envVars, callback){

	try {
	  var doc = yaml.safeLoad(fs.readFileSync(config.templates.module, 'utf8'));
	  console.log(doc);
	} 
	catch (e) {
	  logger.error('The ' + config.templates.module + ' file is damaged, cannot proceed.')
	  console.log(e);
	  process.exit(1);
	}

	// validate doc
	// ({flag, errors} = validate(doc, false));
	// if (!flag){
	// 	logger.error('The ' + config.templates.module + ' file is damaged, cannot proceed.')
	// 	printErrors(errors);
	// 	process.exit(1);
	// }

	try {
	  var functionJson = yaml.safeLoad(fs.readFileSync(__dirname + '/../templates/' + config.templates.function, 'utf8'));
	  console.log(functionJson);
	} 
	catch (e) {
	  logger.error('Internal error cannot proceed.');
	  console.log(e);
	  process.exit(1);
	}

	functionJson.Properties.Handler = doc.Metadata.Entrypoint + '.' + functionHandler;
	functionJson.Properties.Runtime = runtime;
	functionJson.Properties.Environment.Variables = envVars;

	// fill it with function details
	if (!doc.Resources){
		doc.Resources = {};
	}
	doc.Resources[functionName] = functionJson;
	var s = yaml.safeDump(doc, {});

    try {
		// write back module.yaml
		fs.writeFileSync(config.templates.module, s);
		callback(null, { data: {}});
    }
    catch (e) {
	  logger.error('Cannot write ' + config.templates.module);
	  console.log(e);
	  process.exit(1);
	}

	
};