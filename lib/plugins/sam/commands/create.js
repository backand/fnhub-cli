var sam = require('../sam');
var fs = require('fs');
var path = require('path');

module.exports = function(options, fnhub){
    if (!options){
        options = {};
    }
    
    collectOptions(options, fnhub);

    create(options, fnhub, function(err, response){
        if (err) {
            fnhub.logger.debug.error(err);
            if (err.expected && err.message) {
                fnhub.logger.error(err.message);
            }
            else {
                fnhub.logger.error(fnhub.Errors.General.Unexpected);
            }
            process.exit(1);
            }
        else {
            fnhub.logger.success(sam.Messages.Create.AfterSuccess.replace('{{0}}', response.stackFileName));
            process.exit(0);
        }
    });
	
}

function collectOptions(options, fnhub){
	// interact and collect module details
    options.name = options.name || fnhub.readlineSync.question('stack name ($<defaultInput>):', {
		defaultInput: path.basename(process.cwd())
	}) || path.basename(process.cwd());

    options.description = options.description || fnhub.readlineSync.question('description:');

	delete options['_'];
	fnhub.logger.debug.log(options);
   
}


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