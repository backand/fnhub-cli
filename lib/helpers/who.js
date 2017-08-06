var infoHelper    =     require('./info.js');

module.exports.who = who;

function who(fnhub, callback){
    infoHelper.getCurrentUser(fnhub, function(err, user){
        var userInfo = fnhub.resources.Messages.Who.NoUser;
        if(!err && user.username){
            userInfo = user.fullName + " (" + user.username + ")";
        }
        callback(null, {user: userInfo});
    });
}