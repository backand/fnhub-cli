var	yaml = require('js-yaml');
var fs = require('fs');
var validate = require('./validate');
var async = require('async');
var _ = require('lodash');
var config = require('../config');
var printErrors = require('./print-errors-array');
var logger = require('../logger');

module.exports.include = include

function getModuleTemplateYaml(options, callback) {
    try {
	  var doc = yaml.safeLoad(fs.readFileSync(config.templates.module, 'utf8'));
      callback(null, options, doc);
	} 
	catch (e) {
	  console.debug.error(e);
	  callback(new Error({message:'The ' + config.templates.module + ' file is damaged, cannot proceed.', expected:true}));
	}
}

function downloadModuleYaml(options, doc, callback) {
    callback(null, options);
    
}

function prepareStackYaml(options, callback) {
    callback(null, options);
    
}

function validateYaml(options, callback) {
    callback(null, options);
    
}

function saveStackYaml(options, callback) {
    callback(null, options);
    
}

function include(options, callback){
    async.waterfall([
        async.constant(options),
        getModuleTemplateYaml,
        downloadModuleYaml,
        prepareStackYaml,
        validateYaml,
        saveStackYaml
    ], callback);
}

function x(){
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
	var validationResult = validate(doc, false);
	if (validationResult.flag){
		logger.error('The ' + config.templates.module + ' file is damaged, cannot proceed.')
		printErrors(validationResult.errors);
		process.exit(1);
	}

	try {
	  var functionJson = yaml.safeLoad(fs.readFileSync(__dirname + '/../templates/' + config.templates.function, 'utf8'));
	  console.log(functionJson);
	} 
	catch (e) {
	  logger.error('Internal error cannot proceed.');
	  console.log(e);
	  process.exit(1);
	}

	functionJson.Properties.Handler = doc.Metadata.Entrypoint.replace(/\.js/g, '') + '.' + functionHandler;
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