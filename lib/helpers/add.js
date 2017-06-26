var backand = require('@backand/nodejs-sdk');
var	yaml = require('js-yaml');
var fs = require('fs');
var validate = require('./validate');
var async = require('async');

module.exports = function(functionName, functionHandler, envVars, callback){

	try {
	  // read templates/function.yaml
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

	// fill it with function details
	doc.Resources.functionName = 	{ };
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