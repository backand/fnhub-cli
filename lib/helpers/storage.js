'use strict';
var fs = require('fs');

var fileName;

module.exports = {
    init: function(_fileName) {
        fileName = process.argv[1].slice(0, process.argv[1].lastIndexOf(process.bin)) + '\\' + _fileName;
    },
    getItem: function(id) {
        if (fs.existsSync(fileName)) {
            var json = JSON.parse(fs.readFileSync(fileName));
            if (json.hasOwnProperty(id))
                return json[id];
        }
        return null;
    },
    setItem: function(id, value) {
        var json = {};
        if (fs.existsSync(fileName))
            json = JSON.parse(fs.readFileSync(fileName));
        json[id] = value;     
        fs.writeFileSync(fileName, JSON.stringify(json));
    }

}

