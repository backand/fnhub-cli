var yaml                = require('js-yaml');
var fs                  = require('fs');
var SemanticVersion     = require('./semantic-version');

module.exports.get = get;
module.exports.patch = patch;
module.exports.minor = minor;
module.exports.major = major;

function getModuleYamlJson(fnhub){
    return yaml.safeLoad(fs.readFileSync(fnhub.config.templates.module, 'utf8'));
}

function setJsonToModuleYaml(json, fnhub){
    var s = yaml.safeDump(json, {});
    fs.writeFileSync(fnhub.config.templates.module, s);
}

function get(fnhub, callback){
    var json = getModuleYamlJson(fnhub);
    callback(null, json);
}

function patch(fnhub, callback){
    up(fnhub, function(semanticVersion){
        return semanticVersion.patchUp();
    }, callback);
}

function minor(fnhub, callback){
    up(fnhub, function(semanticVersion){
        return semanticVersion.minorUp();
    }, callback);
}

function major(fnhub, callback){
    up(fnhub, function(semanticVersion){
        return semanticVersion.majorUp();
    }, callback);
}

function up(fnhub, levelCallback, callback) {
    var json = getModuleYamlJson(fnhub);
    var versionString = json.Metadata.Version;
    var semanticVersion = new SemanticVersion(versionString);
    json.Metadata.Version = levelCallback(semanticVersion);
    setJsonToModuleYaml(json, fnhub);
    callback(null, json);
}
