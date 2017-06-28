var backand = require('@backand/nodejs-sdk');
var	yaml = require('js-yaml');
var fs = require('fs');
var validate = require('./validate');
var async = require('async');
var _ = require('lodash');

module.exports = function(functionName, functionHandler, runtime, envVars, callback){

	try {
	  var doc = yaml.safeLoad(fs.readFileSync('module.yaml', 'utf8'));
	  console.log(doc);
	} 
	catch (e) {
	  logger.error('The module.yaml file is damaged, cannot proceed.')
	  console.log(e);
	  process.exit(1);
	}

	// validate doc
	{flag, errors} = validate(doc);
	if (!flag){
		logger.error('The module.yaml file is damaged, cannot proceed.')
		logger.error(errors);
		process.exit(1);
	}

	try {
	  var functionJson = yaml.safeLoad(fs.readFileSync('function.yaml', 'utf8'));
	  console.log(functionJson);
	} 
	catch (e) {
	  logger.error('Internal error cannot proceed.')
	  console.log(e);
	  process.exit(1);
	}


	var functionDesc = functionJson.functionname;
	functionDesc.Properties.Handler = doc.Metadata.Entrypoint + '.' + functionHandler;
	functionDesc.Properties.Runtime = runtime;
	functionDesc.Properties.Environment.Variables = envVars;
	functionJson[functionName] = functionJson;

	// fill it with function details
	doc.Resources.functionName = functionJson;
	var s = yaml.safeDump(doc, {});

    try {
		// write back module.yaml
		fs.writeFileSync('module.yaml', s);
		callback(null, { data: {}});
    }
    catch (e) {
	  logger.error('Cannot write module.yaml');
	  console.log(e);
	  process.exit(1);
	}
	
}