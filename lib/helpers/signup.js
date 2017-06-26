var backand = require('@backand/nodejs-sdk');

module.exports.signup = signup;

function signup(firstName, lastName, username, password, confirmPassword, callback){
    backand.signup(firstName, lastName, username, password, confirmPassword, parameters = {})
    .then(function(response){
        callback(null, response)
    })
    .catch(function(err){
        callback(err, null);
    });
}