var exec = require('child_process').exec;

var commands = {
    deploy: 'aws cloudformation deploy --stack-name {{0}} --template-file {{1}} --capabilities CAPABILITY_IAM',
    describeEvents: 'aws cloudformation describe-stack-events --stack-name {{0}}',
    describe: 'aws cloudformation describe-stacks --stack-name {{0}}',
    delete: 'aws cloudformation delete-stack --stack-name {{0}}'
}

var EOL = /\r?\n/

function truthy (obj) {
  return !!obj
}

var deleteStack = function(fnhub, stackName, callback) {
    var opts = {};
    var command = commands.delete.replace('{{0}}', stackName);
    exec(command, {cwd: process.cwd(), maxBuffer: opts.maxBuffer}, function (err, stdout, stderr) {
        if (err) return callback(err)
        if (stderr) return callback(stderr)
        if (stdout) return callback(stdout)
        
        callback(null, null);
    });
}

var deployStack = function(fnhub, stackName, templateFile, callback) {
    var opts = {};
    var command = commands.deploy.replace('{{0}}', stackName).replace('{{1}}', templateFile);
    exec(command, {cwd: process.cwd(), maxBuffer: opts.maxBuffer}, function (err, stdout, stderr) {
        var success = false;
        if (stderr) {
            if (stderr.indexOf('DELETE_IN_PROGRESS') > 0) {
                return callback({message: fnhub.Errors.Cf.Delete.InProgress, expected: true});
            }
            else {
                return callback(stderr);
            }
        }
        if (err) return callback(err)
        var response = { lines: [] }
        stdout.trim().split(EOL).filter(truthy).forEach(function (line) {
            if (line.indexOf('Failed') == 0) {
                describeStackEvents(fnhub, stackName, function(err, response){
                    if (!response.StackEvents || !response.StackEvents.length) {
                        callback({message: fnhub.Errors.Cf.Deploy.MissingStack.replace('{{0}}', stackName), expected: true});
                    }
                    var failures = fnhub_.filter(response.StackEvents, function(stackEvent){
                        return stackEvent.ResourceStatus == "CREATE_FAILED";
                    })
                    .map(function(stackEvent){
                        return stackEvent.ResourceStatusReason;
                    });
                    if (!failures || !failures.length){
                        callback(response);
                    }
                    callback({deployFailures:failures});
                });
            }
            else if (line.indexOf('Successfully') == 0) {
                success = true;
                describeStack(fnhub, stackName, function(err, response){
                    if (!response.Stacks || !response.Stacks.length) {
                        callback({message: fnhub.Errors.Cf.Deploy.MissingStack.replace('{{0}}', stackName), expected: true});
                    }
                    var endpoints = fnhub._.filter(response.Stacks[0].Outputs, function(output){
                        return output.OutputValue;
                    })
                    .map(function(output){
                        return output.OutputValue;
                    });
                    
                    if (!endpoints || !endpoints.length){
                        callback({message: fnhub.Errors.Cf.Deploy.MissingOrIncomprehensiveOutputsOfStack.replace('{{0}}', stackName), expected: true});
                    }

                    callback(null, {endpoints:endpoints});
                });
            }
        })
        if (!success) {
            callback(stdout);
        }
    });
}

var describeStackEvents = function(fnhub, stackName, callback) {
    var opts = {};
    var command = commands.describeEvents.replace('{{0}}', stackName);
    
    exec(command, {cwd: process.cwd(), maxBuffer: opts.maxBuffer}, function (err, stdout, stderr) {
        if (err) return callback(err)
        if (stderr) return callback(stderr)

        var response = JSON.parse(stdout);

        callback(null, response)
    });
}

var describeStack = function(fnhub, stackName, callback) {
    var opts = {};
    var command = commands.describe.replace('{{0}}', stackName);
    
    exec(command, {cwd: process.cwd(), maxBuffer: opts.maxBuffer}, function (err, stdout, stderr) {
        if (err) return callback(err)
        if (stderr) return callback(stderr)

        var response = JSON.parse(stdout);

        callback(null, response)
    });
    
}

module.exports = {
    cloudFormation: {
        stack: {
            deploy: deployStack,
            delete: deleteStack
        }
    }     
}
