var mocha = require("mocha");
var chai = require("chai");
var expect = chai.expect;
var assert = chai.assert;

var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path').dirname(require('path').dirname(require.main.filename)) + "\\bin\\";

describe("sign out success", function(){
    it ("should sign out", function(done){
        this.timeout(64000);
        var command = '"bin/fnshub" signout';
        exec(command, function(err, stdout, stderr) {
            assert(err).to.be.null;
            fs.stat('bin/.backandCache.json', function(err, stats){
                expect(err).not.to.be.null;
                done();
            });
        });
    })
});