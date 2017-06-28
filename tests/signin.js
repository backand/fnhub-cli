var mocha = require("mocha");
var chai = require("chai");
var expect = chai.expect;
var assert = chai.assert;

var exec = require('child_process').exec;
var fs = require('fs');

var path = require('path').dirname(require('path').dirname(require.main.filename)) + "\\bin\\";

describe("signin success", function(){
    it ("should sign in with correct username and password", function(done){
        this.timeout(64000);
        var command = 'bin/fnshub signin --username testfnshub0001@backand.io --password 123456';
        exec(command, function(err, stdout, stderr) {
            assert(err).to.be.null;
            fs.stat('bin/.backandCache.json', function(err, stats){
                expect(err).to.be.null;
                expect(stats.isFile()).to.be.true;
                done();
            });
        });
    })
});