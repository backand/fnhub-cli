var path = require('path');
var fs = require('fs');

module.exports = {
    Consts: {
        Template:{
            Function: 'function.yaml',
            Stack: 'stack.yaml',
            Path: __dirname + '/templates/',
            ModuleName: '\\$ModuleName\\$',
            FunctionName: '\\$FunctionName\\$',
            StackName: '\\$StackName\\$',
            ModuleNameAN: '\\$ModuleNameAN\\$',
            FunctionNameAN: '\\$FunctionNameAN\\$',
            StackNameAN: '\\$StackNameAN\\$',
            PathPart: '\\$PathPart\\$',
            StageName: '\\$StageName\\$',
            Stage: 'TEST',
            Any: 'ANY',
            HttpMethod: '\\$HttpMethod\\$'
        },
        Defaults: {
            Stack: {
                FileName: 'fnhub-stack.yaml'
            }
        }
    },
    Messages: {
        Create: {
            AfterSuccess: 'Stack file saved at {{0}}',
        },
        Include: {
            AfterSuccess: 'Stack file saved at {{0}}',
            IgnoreNonFunction: 'The resource {{0}} is not a function. Currently ignored and will not be added to the stack'
        },
        Deploy: {
            Before: 'The depolyment may take few minutes...'
        },
        Delete: {
            AfterSuccess: 'The stack {{0}} deletion was successfully started'
        }
    },
    Errors: {
        General: {
            StackFileNotFoundOrCorrupted: 'The \'fnhub-stack.yaml\' file was either not found or corrupted'
        },
        Include:{
            StackNotExistsOrCorrupted: 'The fnhub-stack.yaml was not found or corrupted',
            ResourceAlreadyExists: 'A resource with the name {{0}} already exists',
            OutputAlreadyExists: 'An output with the name {{0}} already exists'
        }
    },
    getStackFileName: function() {
        return path.join(process.cwd(), this.Consts.Defaults.Stack.FileName);
    },
    getStackTemplateFileName: function() {
        return path.join(this.Consts.Template.Path, this.Consts.Template.Stack);
    },
    getFunctionTemplateFileName: function() {
        return path.join(this.Consts.Template.Path, this.Consts.Template.Function);
    },
    getStack: function(fnhub) {
        var stackFileName = this.getStackFileName();
		return fnhub.yaml.safeLoad(fs.readFileSync(stackFileName, 'utf8'));
    },
    getStackTemplate: function(fnhub) {
        var templateFileName = this.getStackTemplateFileName();
        return fnhub.yaml.safeLoad(fs.readFileSync(templateFileName, 'utf8'));
    },
    getFunctionTemplate: function(fnhub) {
        var templateFileName = this.getFunctionTemplateFileName();
        return fnhub.yaml.safeLoad(fs.readFileSync(templateFileName, 'utf8'));
    },
    saveStack: function(fnhub, stack){
        // write back stack.yaml
        var s = fnhub.yaml.safeDump(stack, {});
        var stackFileName = this.getStackFileName();
        fs.writeFileSync(stackFileName, s);
        return stackFileName;
    },
    getCommand: function(commandName){
        try {
    		var command = require('./commands/' + commandName)
            return command;
        }
        catch (err){
          return null;
        }
    }
}


