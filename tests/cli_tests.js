var expect = require("chai").expect;
var exec = require('child_process').exec;
var del = require('del');
var fs = require('fs');
var	yaml = require('js-yaml');
var path = require('path');

var config =  require('../lib/config');
var fnhub =  require('../lib/fnhub');

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

describe.skip("init command", function(done){

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

describe.skip("Add Function command", function(){

  it("function values are correct", function (done){
    this.timeout(64000);
    var command = 'bin/fnhub add --name function1 --handler index.handler --runtime nodejs4.3 --env {}';
    exec(command, function(err, stdout, stderr) {
      if (err) throw err;
      //check the file exists
      var doc = yaml.safeLoad(fs.readFileSync(config.templates.module, 'utf8'));
      expect(doc).to.have.any.keys("Resources","Metadata","Description");
      done();
    });
  })
})

describe("Full test", function(){
  var testName = 'test1';
  var user = {
    username:"testfnshub0001@backand.io",
    password:"123456",
    firstname:"firstname"
  };
  var module = {
    "Description":"this is a test description",
    "Metadata":{
      "Name":testName,
      "Author":user.username,
      "Version":"1.1.1",
      "Repo":"https://github.com/test/fnhub",
      "Keywords":["key1","key2","key3"],
      "License":"MIT"
    }
  };
  var cwd = path.join(__dirname, testName);
  var cwdPublisher = path.join(cwd, "publisher");
  var cwdConsumer = path.join(cwd, "consumer");
  var moduleFile = path.join(cwdPublisher, config.yamlFileName);
  var bin = path.join(path.dirname(__dirname), "bin");
  var fnhubPath = path.join(bin, "fnhub");

  describe("Publisher test", function(){
    before(function(done){
      // if (fs.existsSync(cwd)) {
      //   deleteFolderRecursive(cwd);
      // }
      // fs.mkdirSync(cwd);
      // fs.mkdirSync(cwdPublisher);
      // fs.mkdirSync(cwdConsumer);

      done();
    });
    after(function(done){
      // if (fs.existsSync(cwd)) {
      //   del.sync([cwd], {force:true});
      // }
      
      done();
    });
    it("should signin", function (done){
      this.timeout(64000);
      var command = 'node ' + fnhubPath + ' signin --username "' + user.username + '" --password ' + user.password;
      exec(command, {cwd: cwdPublisher}, function(err, stdout, stderr) {
        if (err) throw err;
        //expect success message
        expect(stdout).to.contain(fnhub.Messages.Signin.AfterSuccess.replace('{{0}}', user.firstname));
        done();
      });
    });
    it("should init", function (done){
      this.timeout(64000);
      var command = 'node ' + fnhubPath + ' init --name "' + module.Metadata.Name + '" --author "' + module.Metadata.Author + '" --version ' + module.Metadata.Version + ' --description "' + module.Description + '" --repo ' + module.Metadata.Repo + ' --keywords "' + module.Metadata.Keywords + '" --license ' + module.Metadata.License;
      exec(command, {cwd: cwdPublisher}, function(err, stdout, stderr) {
        if (err) throw err;
        //check the file exists
        fs.stat(moduleFile, function(err, stats){
          expect(stats.isFile()).to.be.true;
          var doc = yaml.safeLoad(fs.readFileSync(moduleFile, 'utf8'));
          //convert to JSON and compare
          var docString = JSON.stringify(doc);
          expect(docString).to.be.equal(JSON.stringify(module));
          done();
        });
      });
    });
    
  }); 
});