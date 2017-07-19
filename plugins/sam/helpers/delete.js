var cf = require('../index');

function runCloudFormation(options, fnhub, stack, callback) {
    fnhub.awscli.cloudFormation.stack.delete(fnhub, options.name, function(err, response) {
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