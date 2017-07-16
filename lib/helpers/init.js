var backand = require('@backand/nodejs-sdk');
var config =  require('../config');
var logger = require('../logger');
var _ = require('lodash');
var	yaml = require('js-yaml');
var fs = require('fs');
var path = require('path');

module.exports = function(options, callback){

	logger.debug.log(options);
	// read templates/module.yaml
	try {
	  var doc = yaml.safeLoad(fs.readFileSync(__dirname + '/../templates/' + config.templates.module, 'utf8'));
	} 
	catch (e) {
	  logger.error('Please reinstall the fnshub cli: npm intall -g fnshub')
	  logger.debug.error(e);
	  process.exit(1);
	}

	// fill in options
	doc.Description = options.description || ' ';
	delete options.description;
	options = _.mapKeys(options, function(value, key){ return _.capitalize(key); });
	options = _.mapValues(options, function(val) { return (val == null? ' ' : val) });
	
	doc.Metadata = _.extend(doc.metadata, options)

	// write module.yaml
	var schema = yaml.safeDump(doc, {});

	try {
		// write back module.yaml
		fs.writeFileSync(path.join(process.cwd(), config.templates.module), schema);
		callback(null, {fileName: config.templates.module});
	}
	catch (e) {
		logger.error('Cannot write ' + config.templates.module);
		logger.debug.error(e);
		process.exit(1);
	}
}