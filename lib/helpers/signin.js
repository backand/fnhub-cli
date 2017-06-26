var backand = require('@backand/nodejs-sdk');

module.exports.signin = signin;

function signin(username, password, callback){
    backand.signin(username, password)
    .then(function(response){
        callback(null, response)
    })
    .catch(function(err){
        callback(err, null);
    });
}