'use strict';
var fs = require('fs');
var path = require('path');

var fileName;

var homeFolder = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;


module.exports = {
    init: function(_fileName) {
        fileName = _fileName;
    },
    getItem: function(id) {
        var rcPath = path.join(homeFolder, fileName);
        if (fs.existsSync(rcPath)) {
            var json = JSON.parse(fs.readFileSync(rcPath));
            if (json.hasOwnProperty(id))
                return json[id];
        }
        return null;
    },
    setItem: function(id, value) {
        var json = {};
        var rcPath = path.join(homeFolder, fileName);
        if (fs.existsSync(rcPath))
            json = JSON.parse(fs.readFileSync(rcPath));
        json[id] = value;     
        fs.writeFileSync(rcPath, JSON.stringify(json));
    },
    delete: function() {
        var rcPath = path.join(homeFolder, fileName);
        if (fs.existsSync(rcPath))
            fs.unlinkSync(rcPath);
    }

}

