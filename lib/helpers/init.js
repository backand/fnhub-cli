var backand = require('@backand/nodejs-sdk');
var _ 			= require('lodash');
var	yaml 		= require('js-yaml');
var fs 			= require('fs');
var path 		= require('path');

var fnhub 		= require('../fnhub');

module.exports = function(options, callback){

	fnhub.logger.debug.log(options);
	// read templates/module.yaml
	try {
	  var doc = yaml.safeLoad(fs.readFileSync(__dirname + '/../templates/' + fnhub.config.templates.module, 'utf8'));
	} 
	catch (e) {
	  fnhub.logger.error('Please reinstall the fnshub cli: npm intall -g fnshub')
	  fnhub.logger.debug.error(e);
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
		fs.writeFileSync(path.join(process.cwd(), fnhub.config.templates.module), schema);
		callback(null, {fileName: fnhub.config.templates.module});
	}
	catch (e) {
		fnhub.logger.error('Cannot write ' + fnhub.config.templates.module);
		fnhub.logger.debug.error(e);
		process.exit(1);
	}
}