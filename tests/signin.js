var mocha = require("mocha");
var chai = require("chai");
var expect = chai.expect;
var assert = chai.assert;

var exec = require('child_process').exec;
var fs = require('fs');

describe("signin success", function(){
    it ("should sign in with correct username and password", function(done){
        this.timeout(64000);
        var commandSignin = '../bin/fnshub signin --username testfnshub0001@backand.io --password 123456';
        exec(commandSignin, function(err, stdout, stderr) {
            fs.stat('bin/.backandCache.json', function(err, stats){
                expect(err).to.be.null;
                expect(stats.isFile()).to.be.true;
                done();
            });
        });
    })
});