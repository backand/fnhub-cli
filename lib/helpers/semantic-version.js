const LevelLength = 3;
const Errors = {
    IllegalVersion: 'Illegal Version'
}
const Dot = '.';

var _this;

function SemanticVersion(versionString) {
    if (!versionString)
        versionString = "0.0.0";
    _this = this;
    fromString(versionString);
}

function fromString(versionString) {
    var levels = versionString.split(Dot);
    if (levels.length != LevelLength){
        throw new Error(Errors.IllegalVersion);
    }

    var major = parseInt(levels[0]);
    var minor = parseInt(levels[1]);
    var patch = parseInt(levels[2]);

    _this.major = major;
    _this.minor = minor;
    _this.patch = patch;
}

SemanticVersion.prototype.patchUp = function(i) {
    if (!i) i = 1;
    _this.patch = _this.patch + i;
    return toString();
}

SemanticVersion.prototype.patchDown = function(i) {
    if (!i) i = 1;
    _this.patch = _this.patch - i;
    return toString();
}

SemanticVersion.prototype.minorUp = function(i) {
    if (!i) i = 1;
    _this.minor = _this.minor + i;
    return toString();
}

SemanticVersion.prototype.minorDown = function(i) {
    if (!i) i = 1;
    _this.minor = _this.minor - i;
    return toString();
}

SemanticVersion.prototype.majorUp = function(i) {
    if (!i) i = 1;
    _this.major = _this.major + i;
    return toString();
}

SemanticVersion.prototype.majorDown = function(i) {
    if (!i) i = 1;
    _this.major = _this.major - i;
    return toString();
}

SemanticVersion.prototype.toString = toString

function toString(){
    return _this.major + Dot + _this.minor + Dot + _this.patch;     
}

module.exports = SemanticVersion;