module.exports.signin = signin;

function signin(username, password, callback){
    global.Backand.signin(username, password)
    .then(function(response){
        callback(null, response)
    })
    .catch(function(err){
        callback(err, null);
    });
}