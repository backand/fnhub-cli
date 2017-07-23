var sam = require('../index');

function getModuleInfo(options, fnhub, callback){
    fnhub.info.getModule(options.module, options.version, fnhub, function(err, moduleInfo) {
        if (err) callback(err);
        else callback(null, options, fnhub, moduleInfo);
    })
}

function getFunctionTemplate(options, fnhub, moduleInfo, callback) {
    try {
        var functionTemplate = sam.getFunctionTemplate(fnhub);
        callback(null, options, fnhub, moduleInfo, functionTemplate);
    }
    catch (err) {
        callback(err, null);
    }
}

function getStack(options, fnhub, moduleInfo, functionTemplate, callback){
    try {
        var stack = sam.getStack(fnhub);
        callback(null, options, fnhub, moduleInfo, functionTemplate, stack);
    }
    catch (err) {
        callback(err, null);
    }
}

function replaceAll(fnhub, target, search, replacement) {
    return target.replace(new RegExp(search, 'g'), replacement);
};

function GetAlphNumeric(target) {
    return replaceAll(null, target, '-', '');
};


function cloneAndReplacePlaceHolders(fnhub, functionTemplate, stackName, moduleName, functionName){
    var json = JSON.stringify(functionTemplate);

    json = replaceAll(fnhub, json, sam.Consts.Template.StackName, stackName);
    json = replaceAll(fnhub, json, sam.Consts.Template.ModuleName, moduleName);
    json = replaceAll(fnhub, json, sam.Consts.Template.FunctionName, functionName);
    json = replaceAll(fnhub, json, sam.Consts.Template.StackNameAN, GetAlphNumeric(stackName));
    json = replaceAll(fnhub, json, sam.Consts.Template.ModuleNameAN, GetAlphNumeric(moduleName));
    json = replaceAll(fnhub, json, sam.Consts.Template.FunctionNameAN, GetAlphNumeric(functionName));
    json = replaceAll(fnhub, json, sam.Consts.Template.PathPart, functionName);
    json = replaceAll(fnhub, json, sam.Consts.Template.StageName, sam.Consts.Template.Stage);
    json = replaceAll(fnhub, json, sam.Consts.Template.HttpMethod, sam.Consts.Template.Any);

    return JSON.parse(json);
}

function copyModuleInfoIntoFunctionTemplate(options, fnhub, moduleInfo, resource, functionTemplate, stack, functionName) {
    var moduleName = moduleInfo.Metadata.Name;
    var stackName = stack.Metadata.Name;
    
    var functionStack = cloneAndReplacePlaceHolders(fnhub, functionTemplate, stackName, moduleName, functionName);   
    var functionResourceName = GetAlphNumeric(stackName) + GetAlphNumeric(moduleName) + GetAlphNumeric(functionName) + 'Function';
    var functionResource = functionStack.Resources[functionResourceName];

    functionResource.Properties.CodeUri = resource.Properties.CodeUri.replace('https', 's3').replace('http', 's3');
    functionResource.Properties.Description = resource.Properties.Description || '';
    functionResource.Properties.Handler = resource.Properties.Handler || '';
    functionResource.Properties.Runtime = resource.Properties.Runtime || '';
    functionResource.Properties.Environment = resource.Properties.Environment || {};
    
    return functionStack;
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
            throw new Error({message:sam.Errors.Include.ResourceAlreadyExists.replace('{{0}}', resourceName), expected:true});
        
        stack.Resources[resourceName] = resource;
    });
}


function copyFunctionOutputsIntoStack(fnhub, stack, functionStack) {
    if (!stack.Outputs) stack.Outputs = {};

    // iterate through the function outputs
    fnhub._.forOwn(functionStack.Outputs, function(output, outputName) { 
        // Check that the resource does not already exist in the stack
        if (stack.Resources.hasOwnProperty(outputName))
            throw new Error({message:sam.Errors.Include.OutputAlreadyExists.replace('{{0}}', outputName), expected:true});
        
        stack.Outputs[outputName] = output;
    });
}


function copyEachFunctionInModuleIntoStack(options, fnhub, moduleInfo, functionTemplate, stack, callback) {
    try {
        // iterate through the module resources
        fnhub._.forOwn(moduleInfo.Resources, function(resource, key) { 
            // only copy resources that are function
            if (isFunction(resource)) {
                var functionStack = copyModuleInfoIntoFunctionTemplate(options, fnhub, moduleInfo, resource, functionTemplate, stack, key);
                copyFunctionResourcesIntoStack(fnhub, stack, functionStack);
                copyFunctionOutputsIntoStack(fnhub, stack, functionStack);
            }
            else {
                //  copy resources other than functions
                stack.Resources[resourceName] = resource;
                fnhub.logger.warn(sam.Messages.Include.CopyNonFunction.replace('{{0}}', key));
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
        var stackFileName = sam.saveStack(fnhub, stack);
		callback(null, { stackFileName: stackFileName });
    }
    catch (e) {
        fnhub.logger.debug.error(e);
        fnhub.logger.debug.error(stack);
        callback({message:fnhub.resources.Errors.General.FailedToSaveYamlFile, expected:true});
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