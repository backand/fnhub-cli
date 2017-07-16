var backand = require('@backand/nodejs-sdk')
var async = require('async');
var config =  require('../config');
var logger  		= require('../logger');
var initHelper  = require('../helpers/init.js');
var readlineSync    = require('readline-sync');
var _ = require('lodash');
var path = require('path');
var git = require('../helpers/git');
var Errors      = require('../errors');
var Messages  	= require('../messages');

function buildQuestion(text, defaultValue){
	return text + '(' + defaultValue + '):';
}

function getCurrentUsername(options, callback){
	backand.user.getUserDetails(false)
	.then(function(res) {
		if (res && res.data && res.data.username){
			options.defaultAuthor = res.data.username;
			callback(null, options)
		} else {
			options.defaultAuthor = "";
			callback(null, options);
		}
	})
	.catch(function(err) {
		callback(null, options);
		console.log(err);
	});
}

function getDefaultRepoURL(options, callback){
	options.defaultRepo = "";
	//get the default git origin url
	var destFolder = process.cwd();
	git.getOriginUrl(destFolder, function(err, data){
		if (!err){
			options.defaultRepo = data;
		}
		callback(err, options);
	})
}

function collectOptions(options, callback){

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

	options.version = options.version ||  readlineSync.question(buildQuestion('version ', '1.0.0')) || '1.0.0';

	options.description = options.description || readlineSync.question('description:');
	if(!options.description){
		logger.warn('Description is required');
		options.description = options.description || readlineSync.question('description:');
		if(!options.description){
			logger.warn('Must enter a description');
			process.exit(1);
		}
	}

	options.repo = options.repo || readlineSync.question(buildQuestion('git repository ', options.defaultRepo)) || options.defaultRepo;
	delete options.defaultRepo;

	options.keywords = options.keywords || readlineSync.question('keywords ($<defaultInput>):', {
		defaultInput: options.name
	}) || options.name;

	options.keywords = options.keywords ? _.words(_.replace(options.keywords, /[;|,]/g, ' '), /[^ ]+/g) : [" "];
	
	options.license = options.license ||  readlineSync.question(buildQuestion('license ', 'ISC')) || 'ISC';

	delete options['_'];
	callback(null, options);
}

function results(options, callback){
	initHelper(options, function(err, response){
		if (err) {
      logger.debug.error(err);
      if (err.expected && err.message) {
        logger.error(err.message);
      }
      else {
        logger.error(Errors.General.Unexpected);
      }
      process.exit(1);
    }
		else {
      logger.success(Messages.Init.AfterSuccess.replace('{{0}}', response.fileName));
      process.exit(0);
    }
	});
}

module.exports = function(options){
    async.waterfall([
			async.constant(options),
			getCurrentUsername,
			getDefaultRepoURL,
			collectOptions,
			results
    ]);
}