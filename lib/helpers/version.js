var config = require('../config');
var yaml = require('js-yaml');
var fs   = require('fs');
var SemanticVersion   = require('./semantic-version');


module.exports.get = get;
module.exports.patch = patch;
module.exports.minor = minor;
module.exports.major = major;

function getModuleYamlJson(){
    return yaml.safeLoad(fs.readFileSync(config.templates.module, 'utf8'));
}

function setJsonToModuleYaml(json){
    var s = yaml.safeDump(json, {});
    fs.writeFileSync(config.templates.module, s);
}

function get(callback){
    var json = getModuleYamlJson();
    callback(null, json);
}

function patch(callback){
    up(function(semanticVersion){
        return semanticVersion.patchUp();
    }, callback);
}

function minor(callback){
    up(function(semanticVersion){
        return semanticVersion.minorUp();
    }, callback);
}

function major(callback){
    up(function(semanticVersion){
        return semanticVersion.majorUp();
    }, callback);
}

function up(levelCallback, callback) {
    var json = getModuleYamlJson();
    var versionString = json.Metadata.Version;
    var semanticVersion = new SemanticVersion(versionString);
    json.Metadata.Version = levelCallback(semanticVersion);
    setJsonToModuleYaml(json);
    callback(null, json);
}
