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
    var command = commands.deploy.replace('{{0}}', stackName).replace('{{1}}', templateFile);
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
        if (err) return callback(err)
        if (stderr) return callback(stderr)
        var response = { lines: [] }
        stdout.trim().split(EOL).filter(truthy).forEach(function (line) {
            if (line.indexOf('Failed') == 0) {
                describeStackEvents(fnhub, stackName, function(err, response){
                    var failures = fnhub_.filter(response.StackEvents, function(stackEvent){
                        return stackEvent.ResourceStatus == "CREATE_FAILED";
                    })
                    .map(function(stackEvent){
                        return stackEvent.ResourceStatusReason;
                    });
                    
                    callback({deployFailures:failures});
                });
            }
            else if (line.indexOf('Successfully') == 0) {
                describeStack(fnhub, stackName, function(err, response){
                    var endpoints = fnhub_.filter(response.Stacks[0].Outputs, function(output){
                        return output.OutputValue;
                    })
                    .map(function(output){
                        return output.OutputValue;
                    });
                    
                    callback({endpoints:endpoints});
                });
            }
        })
        callback(stdout)
    });
}

var describeStackEvents = function(fnhub, stackName, callback) {
    var opts = {};
    var command = commands.describe.replace('{{0}}', stackName);
    
    exec(command, {cwd: process.cwd(), maxBuffer: opts.maxBuffer}, function (err, stdout, stderr) {
        if (err) return callback(err)
        if (stderr) return callback(stderr)

        var response = JSON.parse(stdout);

        callback(null, response)
    });
}

var describeStack = function(fnhub, stackName, callback) {
    var opts = {};
    var command = commands.describeEvents.replace('{{0}}', stackName);
    
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
