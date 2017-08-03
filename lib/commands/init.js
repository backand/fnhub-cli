var backand 				= require('@backand/nodejs-sdk')
var async 					= require('async');
var readlineSync    = require('readline-sync');
var _ 							= require('lodash');
var path 						= require('path');
var git 						= require('../helpers/git');
var infoHelper  		= require('../helpers/info');
var initHelper  		= require('../helpers/init');

function getCurrentUser(options, fnhub, callback){
	infoHelper.getCurrentUser(fnhub, function(err, user){
		if (err) {
			fnhub.logger.debug.error(err);
			options.defaultAuthorEmail = '';
			options.defaultAuthorName = '';
		}
		else {
			options.defaultAuthorEmail = user.username;
			options.defaultAuthorName = user.fullName;
		}
		callback(null, options, fnhub);
	});
}

function getDefaultRepoURL(options, fnhub, callback){
	options.defaultRepo = "";
	//get the default git origin url
	var destFolder = process.cwd();
	git.getOriginUrl(destFolder, function(err, data){
		if (!err){
			options.defaultRepo = data;
		}
		else {
			fnhub.logger.debug.error(err);
			options.defaultRepo = '';
			fnhub.logger.error(fnhub.resources.Errors.Init.NoRepo);
			process.exit(1);
		}

		callback(err, options, fnhub);
		
	})
}

function isValidModuleName(fnhub, name){
	return name && new RegExp(fnhub.Consts.Validation.Regex.AlphanumericAndDashes).test(name);
}

function collectOptions(options, fnhub, callback){
	// interact and collect module details

	if (!isValidModuleName(fnhub, options.name)){
		var q = fnhub.resources.Questions.Init.Name;
		if (options.name){
			fnhub.logger.warn(fnhub.resources.Messages.Init.NameValid);
			options.name = readlineSync.question(q, {
				defaultInput: path.basename(process.cwd()),
			}) || path.basename(process.cwd());
		}
		else {
			options.name = options.name || readlineSync.question(q, {
				defaultInput: path.basename(process.cwd()),
			}) || path.basename(process.cwd());
		}
		if (!isValidModuleName(fnhub, options.name)){
			fnhub.logger.warn(fnhub.resources.Messages.Init.NameValid);
			options.name = readlineSync.question(q, {
				defaultInput: path.basename(process.cwd()),
			});
			if (!isValidModuleName(fnhub, options.name)){
				fnhub.logger.warn(fnhub.resources.Messages.Init.NameValid);
				process.exit(1);
			}
		}
	}

	if (options.defaultAuthorEmail) {
		options.authorEmail = options.authorEmail || readlineSync.question(fnhub.resources.Questions.Init.AuthorEmail, {
			defaultInput: options.defaultAuthorEmail
		}) || options.defaultAuthorEmail;
	}
	else {
		options.authorEmail = options.authorEmail || readlineSync.question(fnhub.resources.Questions.Init.AuthorEmailNo);
	}
	delete options.defaultAuthorEmail;

	if (options.defaultAuthorName) {
		options.authorName = options.authorName || readlineSync.question(fnhub.resources.Questions.Init.AuthorName, {
			defaultInput: options.defaultAuthorName
		}) || options.defaultAuthorName;
	}
	else {
		options.authorName = options.authorName || readlineSync.question(fnhub.resources.Questions.Init.AuthorNameNo);
	}
	delete options.defaultAuthorName;


	options.version = options.version ||  readlineSync.question(fnhub.resources.Questions.Init.Version,{
		defaultInput: '1.0.0'
	}) || '1.0.0';
		
	options.description = options.description || readlineSync.question(fnhub.resources.Questions.Init.Description);
	if(!options.description){
		fnhub.logger.warn('Description is required');
		options.description = options.description || readlineSync.question(fnhub.resources.Questions.Init.Description);
		if(!options.description){
			fnhub.logger.warn('Must enter a description');
			process.exit(1);
		}
	}

	options.repo = options.repo || readlineSync.question(fnhub.resources.Questions.Init.GitRepo, {
		defaultInput: options.defaultRepo
	}) || options.defaultRepo;
	delete options.defaultRepo;

	options.keywords = options.keywords || readlineSync.question(fnhub.resources.Questions.Init.Keywords, {
		defaultInput: options.name
	}) || options.name;

	options.keywords = options.keywords ? _.words(_.replace(options.keywords, /[;|,]/g, ' '), /[^ ]+/g) : [" "];
	
	options.license = options.license ||  readlineSync.question(fnhub.resources.Questions.Init.License, {
		defaultInput: 'ISC'
	}) || 'ISC';

	delete options['_'];
	callback(null, options, fnhub);
}

function results(options, fnhub, callback){
	initHelper(options, fnhub, function(err, response){
		if (err) {
      fnhub.logger.debug.error(err);
      if (err.expected && err.message) {
        fnhub.logger.error(err.message);
      }
      else {
        fnhub.logger.error(fnhub.resources.Errors.General.Unexpected);
      }
      process.exit(1);
    }
		else {
      fnhub.logger.success(fnhub.resources.Messages.Init.AfterSuccess,response.fileName);
      process.exit(0);
    }
	});
}

module.exports = function(options, fnhub){
    async.waterfall([
			async.constant(options, fnhub),
			getCurrentUser,
			getDefaultRepoURL,
			collectOptions,
			results
    ]);
}