var cf = require('../index');

function validate(options, fnhub, stack, callback){
    callback(null, options, fnhub, stack);
}

function runCloudFormation(options, fnhub, stack, callback) {
    fnhub.awscli.cloudFormation.stack.deploy(fnhub, options.name, cf.getStackFileName(), function(err, response) {
        if (err) callback(err);
        else callback(null, response);
    });
}

function deploy(options, fnhub, stack, callback){
    fnhub.async.waterfall([
        fnhub.async.constant(options, fnhub, stack),
        validate,
        runCloudFormation 
    ], callback);
}

module.exports.deploy = deploy