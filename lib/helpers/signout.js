var storage    =     require('./storage.js');

module.exports.signout = signout;

function signout(){
    storage.delete()
}