var path = require('path');

module.exports = {
    Consts: {
        Template:{
            Module: 'module.yaml',
            Stack: 'stack.yaml',
            Path: __dirname + '/templates/'
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
        }
    },
    getStackFileName: function() {
        return path.join(process.cwd(), this.Consts.Defaults.Stack.FileName);
    },
    getCommand: function(commandName){
        console.log('sam getCommand');
    	try {
    		var command = require('./commands/' + commandName)
            return command;
        }
        catch (err){
          return null;
        }
    }
}


