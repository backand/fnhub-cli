var backand = require('@backand/nodejs-sdk')
var config =  require('../config');
var logger  		= require('../logger');
var initHelper  = require('../helpers/init.js');
var readlineSync    = require('readline-sync');
var _ = require('lodash');

module.exports = function(options){

	if (!options){
		options = {};
	}
	
	// interact and collect module details
	options.name = options.name || readlineSync.question('name:', {
	  defaultInput: path.basename(process.cwd())
	});

	options.version = options.version ||  readlineSync.question('version:', {
	  defaultInput: '1.0.0'
	});

	options.description = options.description || readlineSync.question('description:');

	options.entryPoint = options.entryPoint ||  readlineSync.question('entry point:', {
	  defaultInput: 'index.js'
	});

	options.repo = options.repo || readlineSync.question('git repository:', {
	  defaultInput: 'https://github.com/' + _.replace(options.author, ' ', '') + '/' + options.name
	});

	options.keywords = options.keywords ||  readlineSync.question('keywords:');

	options.keywords = _.words(_.replace(options.keywords, /[;|,]/, ' '), /[^ ]+/g);
	
	options.author = options.author || readlineSync.question('author:');

	options.license = options.license ||  readlineSync.question('license:', {
	  defaultInput: 'ISC'
	});


	initHelper(options, function(err, response){
		if (err) console.error(err);
		else console.log('Module ready', response.data);
	});
}