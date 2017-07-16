var cf = require('../index');

function getModuleInfo(options, fnhub, callback){
    fnhub.info.getModule(options.module, options.version, function(err, moduleInfo) {
        if (err) callback(err);
        else callback(null, options, fnhub, moduleInfo);
    })
}

function getFunctionTemplate(options, fnhub, moduleInfo, callback) {
    try {
        var functionTemplate = cf.getFunctionTemplate(fnhub);
        callback(null, options, fnhub, moduleInfo, functionTemplate);
    }
    catch (err) {
        callback(err, null);
    }
}

function getStack(options, fnhub, moduleInfo, functionTemplate, callback){
    try {
        var stack = cf.getStack(fnhub);
        callback(null, options, fnhub, moduleInfo, functionTemplate, stack);
    }
    catch (err) {
        callback(err, null);
    }
}

 function replaceAll(fnhub, target, search, replacement) {
    return target.replace(new RegExp(search, 'g'), replacement);
};

function clodeAndReplacePlaceHolders(fnhub, functionTemplate, moduleName, functionName){
    var json = JSON.stringify(functionTemplate);

    json = replaceAll(fnhub, json, cf.Consts.Template.ModuleName, moduleName);
    json = replaceAll(fnhub, json, cf.Consts.Template.FunctionName, functionName);

    return JSON.parse(json);
}

function copyModuleInfoIntoFunctionTemplate(options, fnhub, moduleInfo, functionTemplate, stack, functionName) {
    var moduleName = moduleInfo.Metadata.Name;
    
    var func = clodeAndReplacePlaceHolders(fnhub, functionTemplate, moduleName, functionName);   
    
    func.CodeUri = moduleInfo.CodeUri;
    func.Description = moduleInfo.Description;
    func.Handler = moduleInfo.Handler;
    func.Runtime = moduleInfo.Runtime;
    func.Environment = moduleInfo.Environment;
    
    return func;
}

function isFunction(resource) {
    return resource.Type == 'AWS::Serverless::Function';
}

function copyFunctionResourcesIntoStack(fnhub, stack, functionStack) {
    if (!stack.Resources) stack.Resources = {};
        
    // iterate through the function resources
    fnhub._.forOwn(functionStack.Resources, function(resource, resourceName) { 
        // Check that the resource does not already exist in the stack
        if (stack.Resources.hasOwnProperty(resourceName))
            throw new Error({message:cf.Errors.Include.ResourceAlreadyExists.replace('{{0}}', resourceName), expected:true});
        
        stack.Resources[resourceName] = resource;
    });
}

function copyEachFunctionInModuleIntoStack(options, fnhub, moduleInfo, functionTemplate, stack, callback) {
    try {
        // iterate through the module resources
        fnhub._.forOwn(moduleInfo.Resources, function(resource, key) { 
            // only copy resources that are function
            if (isFunction(resource)) {
                var functionStack = copyModuleInfoIntoFunctionTemplate(options, fnhub, moduleInfo, functionTemplate, stack, key);
                copyFunctionResourcesIntoStack(fnhub, stack, functionStack);
            }
            else {
                //  ignore resources other than functions
            }
        } );

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
        var stackFileName = cf.saveStack(fnhub, stack);
		callback(null, { stackFileName: stackFileName });
    }
    catch (e) {
        fnhub.logger.debug.error(e);
        callback({message:fnhub.Errors.General.FailedToSaveYamlFile, expected:true});
	}
}

function include(options, fnhub, callback){
    fnhub.async.waterfall([
        fnhub.async.constant(options, fnhub),
        getModuleInfo,
        getFunctionTemplate,
        getStack,
        copyEachFunctionInModuleIntoStack,
        validate,
        save
    ], callback);
}

module.exports.include = include