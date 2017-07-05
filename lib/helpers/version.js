module.exports.get = get;
module.exports.patch = patch;
module.exports.minor = minor;
module.exports.major = major;

function get(callback){
    callback(null, {name:'aaa', version:"1.0.0"});
}

function patch(callback){
    callback(null, {name:'aaa', version:"1.0.1"});
}

function minor(callback){
    callback(null, {name:'aaa', version:"1.1.0"});
}

function major(callback){
    callback(null, {name:'aaa', version:"2.0.0"});
}