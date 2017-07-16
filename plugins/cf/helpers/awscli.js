var exec = require('child_process').exec;

var EOL = /\r?\n/

function truthy (obj) {
  return !!obj
}

var createStack = function(stackName, templateFile, callback) {
    var opts = {};
    var command = 'aws  cloudformation deploy --stack-name ' + stackName + ' --template-file ' + templateFile + ' --capabilities CAPABILITY_IAM';
    exec(command, {cwd: process.cwd(), maxBuffer: opts.maxBuffer}, function (err, stdout, stderr) {
        if (err) return callback(err)
        var response = { lines: [] }
        stdout.trim().split(EOL).filter(truthy).forEach(function (line) {
            response.lines.push(line);
        })
        callback(null, response)
    });
    
}

module.exports = {
    cloudFormation: {
        stack: {
            create: createStack
        }
    }     
}
