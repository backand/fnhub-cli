var backand = require('@backand/nodejs-sdk');
var config =  require('../config');
var logger = require('../logger');
var _ = require('lodash');
var	yaml = require('js-yaml');
var fs = require('fs');

module.exports = function(options, callback){

	console.log(options);
	// read templates/module.yaml
	try {
	  var doc = yaml.safeLoad(fs.readFileSync(__dirname + '/../templates/' + config.templates.module, 'utf8'));
	  // console.log(doc);
	} 
	catch (e) {
	  logger.error('Please reinstall the fnshub cli: npm intall -g fnshub')
	  console.log(e);
	  process.exit(1);
	}

	// fill in options
	doc.Description = options.description || ' ';
	delete options.description;
	options = _.mapKeys(options, (value, key) => _.capitalize(key));
	options = _.mapValues(options, (val) => (val == null? ' ' : val));
	
	
	doc.Metadata = _.extend(doc.metadata, options)
	doc.Resources = '\"\"';
	console.log(doc);

	// write module.yaml
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

	callback(null, { data: {}});
}