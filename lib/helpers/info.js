var backand     = require('@backand/nodejs-sdk');

module.exports.getModule = getModule;

var infoLambda = {
    name:'module',
    get:'get'
}

function getModule(name, version, fnhub, callback) {
    backand.fn.post(infoLambda.name, {name:name, version:version, path:infoLambda.get})
    .then(function(response){
        if (response.status == 200 && response.data)
            callback(null, response.data);
        else
            callback(response, null);
    })
    .catch(function(err){
        callback(err, null);
    });
}

module.exports.getCurrentUser = getCurrentUser;

function getCurrentUser(fnhub, callback){
    backand.user.getUserDetails(false)
	.then(function(res) {
		if (res && res.data && res.data.username){
			callback(null, res.data)
		} else {
			callback('Current user was not found. Run signin command and try again.', null);
		}
	})
	.catch(function(err) {
		callback(null, options);
		fnhub.logger.debug.error(err);
	});
}