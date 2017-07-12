var sam = require('../index');
var fs = require('fs');

module.exports = function(options, fnhub){
    console.log('include');
	// interact and collect function details
    if (!options){
        options = {};
    }
    
    collectOptions(options, fnhub);

    include(options, fnhub, function(err, response){
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
            fnhub.logger.success(sam.Messages.Include.AfterSuccess.replace('{{0}}', response.stackFileName));
            process.exit(0);
        }
    });
}

function collectOptions(options, fnhub){
	// interact and collect module details
    
    if(!options.module){
	    fnhub.logger.log('Please provide the module name, in order to include it\n'.blue)
	        .log('Or you can complete the wizard below:\n');
	}

    options.module = options.module || fnhub.readlineSync.question('module: '.grey);

    if (options.module.indexOf(fnhub.Consts.Version.ModuleSeperator) > 0){
        var nameAndVersion = options.module.split(fnhub.Consts.Version.ModuleSeperator);
        if (nameAndVersion.length != 2) {
            fnhub.logger.error(fnhub.Errors.Include.IllegalModuleNameAndVersion);
            process.exit(1);
        }

        options.module = nameAndVersion[0];

        if (options.version) {
            fnhub.logger.error(Errors.Include.VersionConflict);
            process.exit(1);
        }
        else{
            options.version = nameAndVersion[1];
        }
    }
    else{
        options.version = options.version || fnhub.readlineSync.question('version ($<defaultInput>):', {
            defaultInput: fnhub.Consts.Version.Latest
        }) || fnhub.Consts.Version.Latest;
    }
    
    delete options['_'];
	fnhub.logger.debug.log(options);
}

function getModuleInfo(options, fnhub, callback){
    fnhub.info.getModule(options.module, options.version, function(err, moduleInfo) {
        if (err) callback(err);
        else callback(null, options, fnhub, moduleInfo);
    })
}

function getStack(options, fnhub, moduleInfo, callback){
    try {
        var stackFileName = sam.getStackFileName();
		var stack = fnhub.yaml.safeLoad(fs.readFileSync(stackFileName, 'utf8'));
        callback(null, options, fnhub, moduleInfo, stack);
    }
    catch (err) {
        callback(err, null);
    }
}

function copyModuleIntoStack(options, fnhub, moduleInfo, stack, callback) {
    try {
        stack.Resources = fnhub._.mapKeys( moduleInfo.Resources, function(value, key) {
            return moduleInfo.Metadata.Name + fnhub.Consts.Lambda.ModuleFunctionSeperator + key;
        });
        callback(null, options, fnhub, stack);
    }
    catch (err) {
        callback(err, null);
    }
}

function validate(options, fnhub, stack, callback){
    callback(null, options, fnhub, stack);
}

function save(options, fnhub, stack, callback){
    
    try {
		// write back stack.yaml
        var s = fnhub.yaml.safeDump(stack, {});
        var stackFileName = sam.getStackFileName();
		fs.writeFileSync(stackFileName, s);
        callback(null, { stackFileName: stackFileName });
    }
    catch (e) {
        callback(new Error({message:fnhub.Errors.FailedToSaveFile, expected:true}));
	}
}

function include(options, fnhub, callback){
    fnhub.async.waterfall([
        fnhub.async.constant(options, fnhub),
        getModuleInfo,
        getStack,
        copyModuleIntoStack,
        validate,
        save
    ], callback);
}