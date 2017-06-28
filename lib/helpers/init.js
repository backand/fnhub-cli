var backand = require('@backand/nodejs-sdk');
var config =  require('../config');
var _ = require('lodash');

module.exports = function(options, callback){


	// read templates/module.yaml
	try {
	  var doc = yaml.safeLoad(fs.readFileSync('../templates/' + config.templates.module, 'utf8'));
	  console.log(doc);
	} 
	catch (e) {
	  logger.error('Please reinstall the fnshub cli: npm intall -g fnshub')
	  console.log(e);
	  process.exit(1);
	}

	// fill in options
	doc.description = options.description;
	delete options.description;
	doc.metadata = _.extend(doc.metadata, options)


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