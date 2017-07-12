var sam = require('../sam');
var fs = require('fs');
var path = require('path');

function getStackTemplate(options, fnhub, callback) {
    try {
        var templateFileName = path.join(sam.Consts.Template.Path, sam.Consts.Template.Stack);
        var stackTemplate = fnhub.yaml.safeLoad(fs.readFileSync(templateFileName, 'utf8'));
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

function save(fnhub, stackTemplate, callback){
    var s = fnhub.yaml.safeDump(stackTemplate, {});

    try {
		// write back stack.yaml
        var stackFileName = sam.getStackFileName();
		fs.writeFileSync(stackFileName, s);
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