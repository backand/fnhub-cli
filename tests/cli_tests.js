var expect = require("chai").expect;
var exec = require('child_process').exec;
var del = require('del');
var fs = require('fs');
var	yaml = require('js-yaml');

var config =  require('../lib/config');

describe("init command", function(done){

  before(function(done){
    del.sync(['module.yaml']);
    done();
  });

  it("module file created", function (done){
    this.timeout(64000);
    var command = 'bin/fnhub init --name "test function" --author test@backand.io --version 1.1.1 --description "this is a test description" --repo https://github.com/test/fnhub --keywords "key1 key2,key3" --license MIT';
    exec(command, function(err, stdout, stderr) {
      if (err) throw err;
      //check the file exists
      fs.stat('module.yaml', function(err, stats){
        expect(stats.isFile()).to.be.true;
        done();
      });
    });
  })
  it("module.yaml values are correct", function (){
    this.timeout(64000);
    //read the yaml file
    var doc = yaml.safeLoad(fs.readFileSync(config.templates.module, 'utf8'));
    //convert to JSON and compare
    var docString = JSON.stringify(doc);
    expect(docString).to.be.equal('{"Description":"this is a test description","Metadata":{"Name":"test function","Author":"test@backand.io","Version":"1.1.1","Repo":"https://github.com/test/fnhub","Keywords":["key1","key2","key3"],"License":"MIT"}}');
  })

})