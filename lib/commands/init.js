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
	getCurrentUsername(function(err, username){
		if (!options){
			options = {};
		}
		options.defaultAuthor = username;

		collectOptions(options);

		initHelper(options, function(err, response){
			if (err) console.error(err);
			else console.log('Module ready', response.data);
		});
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

function getCurrentUsername(callback){
	backand.user.getUserDetails(false)
	.then(function(res) {
		if (res && res.data && res.data.username)
			callback(null, res.data.username);
		else callback(null, null);
		console.log(res.data);
	})
	.catch(function(err) {
		callback(null, null);
		console.log(err);
	});
}

function collectOptions(options){
	// interact and collect module details
	options.name = options.name || readlineSync.question('name ($<defaultInput>):', {
		defaultInput: path.basename(process.cwd())
	}) || path.basename(process.cwd());

	if (options.defaultAuthor) {
		options.author = options.author || readlineSync.question('author ($<defaultInput>):', {
			defaultInput: options.defaultAuthor
		}) || options.defaultAuthor;
	}
	else {
		options.author = options.author || readlineSync.question('author:');
	}
	delete options.defaultAuthor;

	options.version = options.version ||  readlineSync.question(buildQuestion('version', '1.0.0')) || '1.0.0';

	options.description = options.description || readlineSync.question('description:');

	options.entryPoint = options.entryPoint ||  readlineSync.question(buildQuestion('entry point', 'index.js')) || 'index.js';

	var defaultRepo = 'https://github.com/' + _.replace(options.author, ' ', '').toLowerCase() + '/' + options.name;
	options.repo = options.repo || readlineSync.question(buildQuestion('git repository', defaultRepo)) || defaultRepo;

	options.keywords = options.keywords || readlineSync.question('keywords ($<defaultInput>):', {
		defaultInput: options.name
	}) || options.name;

	console.log("keywords", options.keywords);
	options.keywords = options.keywords ? _.words(_.replace(options.keywords, /[;|,]/, ' '), /[^ ]+/g) : [" "];
	console.log("keywords", options.keywords);
	
	options.license = options.license ||  readlineSync.question(buildQuestion('license', 'ISC')) || 'ISC';

	delete options['_'];
	logger.log(options);
}