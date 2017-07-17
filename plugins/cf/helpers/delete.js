var cf = require('../index');
var awscli = require('./awscli');

function runCloudFormation(options, fnhub, stack, callback) {
    awscli.cloudFormation.stack.delete(fnhub, options.name, function(err, response) {
        if (err) callback(err);
        else callback(null, response);
    });
}

function deleteStack(options, fnhub, stack, callback){
    fnhub.async.waterfall([
        fnhub.async.constant(options, fnhub, stack),
        runCloudFormation 
    ], callback);
}

module.exports.deleteStack = deleteStack