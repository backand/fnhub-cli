var cf = require('../index');
var fs = require('fs');
var path = require('path');

function getStackTemplate(options, fnhub, callback) {
    try {
        var stackTemplate = cf.getStackTemplate(fnhub);
        callback(null, options, fnhub, stackTemplate);
    }
    catch (err) {
        callback(err, null);
    }
}


function copyOptionsIntoStack(options, fnhub, stackTemplate, callback) {
    stackTemplate.Description = options.description;
    stackTemplate.Metadata.Name = options.name;
    callback(null, fnhub, stackTemplate);        
}

function save(fnhub, stack, callback){
    try {
		// write back stack.yaml
        var stackFileName = cf.saveStack(fnhub, stack);
		callback(null, { stackFileName: stackFileName });
    }
    catch (e) {
        callback(new Error({message:Errors.FailedToSaveFile, expected:true}));
	}
}

function create(options, fnhub, callback){
    fnhub.async.waterfall([
        fnhub.async.constant(options, fnhub),
        getStackTemplate,
        copyOptionsIntoStack,
        save
    ], callback);
}

module.exports.create = create