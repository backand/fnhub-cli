var backand = require('@backand/nodejs-sdk')
var config =  require('../config');
var logger  		= require('../logger');
var initHelper  = require('../helpers/init.js');
var readlineSync    = require('readline-sync');
var _ = require('lodash');
var path = require('path');

function buildQuestion(text, defaultValue){
	return text + '(' + defaultValue + '):';
}

module.exports = function(options){

	if (!options){
		options = {};
	}
	
	// interact and collect module details
	options.name = options.name || readlineSync.question('name ($<defaultInput>):', {
		defaultInput: path.basename(process.cwd())
	}) || path.basename(process.cwd());

	options.author = options.author || readlineSync.question('author:');

	options.version = options.version ||  readlineSync.question(buildQuestion('version', '1.0.0')) || '1.0.0';

	options.description = options.description || readlineSync.question('description:');

	options.entryPoint = options.entryPoint ||  readlineSync.question(buildQuestion('entry point', 'index.js')) || 'index.js';

	var defaultRepo = 'https://github.com/' + _.replace(options.author, ' ', '').toLowerCase() + '/' + options.name;
	options.repo = options.repo || readlineSync.question(buildQuestion('git repository', defaultRepo)) || defaultRepo;

	options.keywords = options.keywords;// ||  readlineSync.question('keywords:');

	options.keywords = options.keywords ? _.words(_.replace(options.keywords, /[;|,]/, ' '), /[^ ]+/g) : [" "];

	options.license = options.license ||  readlineSync.question(buildQuestion('license', 'ISC')) || 'ISC';

	delete options['_'];
	logger.log(options);

	initHelper(options, function(err, response){
		if (err) console.error(err);
		else console.log('Module ready', response.data);
	});

	// if (readlineSync.keyInYNStrict('Is this correct?')) {
	// 	initHelper(options, function(err, response){
	// 		if (err) console.error(err);
	// 		else console.log('Module ready', response.data);
	// 	});
	// }
	// else {
	// 	logger.error('Please call init again to start over!');
	// }

}