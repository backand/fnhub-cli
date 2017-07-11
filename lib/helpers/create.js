var backand = require('@backand/nodejs-sdk');
var config =  require('../config');
var logger = require('../logger');
var _ = require('lodash');
var	yaml = require('js-yaml');
var fs = require('fs');
var path = require('path');
var async = require('async');
var Errors  		= require('../errors');
var Messages  	= require('../messages');
var providers  		= require('../providers');

module.exports.create = create;

function getStackYamlTemplate(provider){
    return yaml.safeLoad(fs.readFileSync(__dirname + '/../templates/providers/' + provider + '/' + config.templates.providers[provider].template, 'utf8'));
}


function prepareStackYaml(provider, name, description, template){
    switch(provider) {
        case providers.aws:
            template.Description = description;
            template.Metadata.Name = name;
            break;
        
        default:
            throw new Error({message:Errors.ProviderNotSupported.replace('{{0}}', provider), expected:true});
    }

    return template;
}

function saveStackYaml(provider, template){
    var s = yaml.safeDump(template, {});

    try {
		// write back module.yaml
		fs.writeFileSync(path.join(process.cwd(), config.templates.providers[provider]), s);
    }
    catch (e) {
        logger.debug.error(e);
        throw new Error({message:Errors.FailedToSaveFile, expected:true});
	}
}

function create(options, callback){
    try{
        var template = getStackYamlTemplate(options.provider);
        template = prepareStackYaml(options.provider, options.name, options.description, template);
        saveStackYaml(options.provider, template);
        callback(null, {templateName: path.join(process.cwd(), config.templates.providers[options.provider])});
    }
    catch(err){
        logger.debug.error(err);
        callback(err, null);
    }
}