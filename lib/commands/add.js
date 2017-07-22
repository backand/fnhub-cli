var async 				= require('async');
var	yaml 					= require('js-yaml');
var fs 						= require('fs');
var readlineSync  = require('readline-sync');
var addHelper  		= require('../helpers/add.js');
var fnhub 				= require('../fnhub');

function collectOptions(options, callback){
	//interact and collect function details

	if(!options.name || !options.handler || !options.runtime){
		fnhub.logger.log(fnhub.resources.Messages.Add.Instructions);
	}

	try {
	  var doc = yaml.safeLoad(fs.readFileSync(fnhub.config.templates.module, 'utf8'));
	} 
	catch (e) {
	  fnhub.logger.error(fnhub.resources.Messages.Add.FileError, fnhub.config.templates.module);
		fnhub.logger.debug.error(e);
	  process.exit(1);
	}

	options.name = options.name || readlineSync.question(fnhub.resources.Questions.Add.Name, {
		defaultInput: doc.Metadata.Name 
	});
	if(!options.name || options.name.length === 0){
		fnhub.logger.warn(fnhub.resources.Messages.Add.NameRequired,'function name');
		options.name = readlineSync.question(fnhub.resources.Questions.Add.Name);
		if(!options.name){
			fnhub.logger.warn(fnhub.resources.Messages.Add.NameIsMust,'function name');
			process.exit(1);
		}
	}

	options.description = options.description || readlineSync.question(fnhub.resources.Questions.Add.Description, {
		defaultInput: doc.Description 
	});
	if(!options.description || options.description.length === 0){
		fnhub.logger.warn(fnhub.resources.Messages.Add.NameRequired,'function description');
		options.description = readlineSync.question(fnhub.resources.Questions.Add.Description);
		if(!options.description){
			fnhub.logger.warn(fnhub.resources.Messages.Add.NameIsMust,'function description');
			process.exit(1);
		}
	}
  
	if (!options.runtime){
		var runtime = fnhub.config.aws.runtime; 
		index = readlineSync.keyInSelect(runtime, fnhub.resources.Questions.Add.Runtime, {cancel: false});
		fnhub.logger.debug.log(runtime[index] + ' is enabled.');
		options.runtime = runtime[index];
	}

	//get default 
	if(!options.handler) {
		var defaultHandler = fnhub.config.aws.defaultHandler;
		options.handler = readlineSync.question(fnhub.resources.Questions.Add.Handler, {
			defaultInput: defaultHandler[index]
		});
	}

	if(!options.env){ //only ask if the object was not provided
		options.env = readlineSync.question(fnhub.resources.Questions.Add.Env);
		try{
			if(options.env) {
				options.env = JSON.parse(options.env);
			}
		}
		catch(e){
			fnhub.logger.warn(fnhub.resources.Messages.Add.EnvMustBeJSON);
			process.exit(1);
		}
	}

	delete options['_'];
	callback(null, options);
}

function results(options, callback){
	addHelper(options, function(err, response){
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
      fnhub.logger.success(fnhub.resources.Messages.Function.AfterSuccess,options.name);
      process.exit(0);
    }
	});
}

module.exports = function(options){
	async.waterfall([
		async.constant(options),
		collectOptions,
		results
	]);
}