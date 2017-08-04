var expect    = require("chai").expect;
var exec      = require('child_process').exec;
var del       = require('del');
var fs        = require('fs');
var	yaml      = require('js-yaml');
var path      = require('path');
var async     = require('async');
var request   = require('request');
var util      = require('util');


var fnhub     = require('../lib/fnhub');
var cfPlugin  = require('../plugins/cf/index');
var samPlugin = require('../plugins/sam/index');

var EOL = /\r?\n/

function truthy (obj) {
  return !!obj
}

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

describe("Help commands and default help display", function(){
  var bin = path.join(path.dirname(__dirname), "bin");
  var fnhubPath = path.join(bin, "fnhub");
  describe("Default command", function(){
    it("Outputs the help warning", function(done){
      this.timeout(64000);
      var command = fnhubPath;
      exec(command, {}, function(err, stdout, stderr) {
        if (stderr){
          console.error("command", command);
          console.error("stderr", stderr);
        }
        expect(!stderr).to.be.true;
        if (err) {
          console.error("command", command);
          console.error("err", err);
          console.error("stderr", stderr);
          console.error("stdout", stdout);
        }
        expect(err).to.be.null;
        expect(stdout).to.contain(fnhub.resources.Messages.Help.DefaultCommandWarning);
        done();
      });
    });
  });
  describe("Help command", function(){
    it("Outputs the help content", function(done){
      this.timeout(64000);
      var command = fnhubPath + ' help';
      exec(command, {}, function(err, stdout, stderr) {
        if (stderr){
          console.error("command", command);
          console.error("stderr", stderr);
        }
        expect(!stderr).to.be.true;
        if (err) {
          console.error("command", command);
          console.error("err", err);
          console.error("stderr", stderr);
          console.error("stdout", stdout);
        }
    		expect(stdout).to.contain(fnhub.resources.Messages.Help.HelpIntro);
    		expect(stdout).to.contain(fnhub.resources.Messages.Help.Init);
    		expect(stdout).to.contain(fnhub.resources.Messages.Help.Add);
    		expect(stdout).to.contain(fnhub.resources.Messages.Help.Delete);
    		expect(stdout).to.contain(fnhub.resources.Messages.Help.Info);
    		expect(stdout).to.contain(fnhub.resources.Messages.Help.Who);
    		expect(stdout).to.contain(fnhub.resources.Messages.Help.Publish);
    		expect(stdout).to.contain(fnhub.resources.Messages.Help.Signin);
    		expect(stdout).to.contain(fnhub.resources.Messages.Help.Signout);
    		expect(stdout).to.contain(fnhub.resources.Messages.Help.Signup);
    		expect(stdout).to.contain(fnhub.resources.Messages.Help.Version);
    		expect(stdout).to.contain(fnhub.resources.Messages.Help.VersionMajor);
    		expect(stdout).to.contain(fnhub.resources.Messages.Help.VersionMinor);
    		expect(stdout).to.contain(fnhub.resources.Messages.Help.VersionPatch);
    		expect(stdout).to.contain(fnhub.resources.Messages.Help.CfCreate);
    		expect(stdout).to.contain(fnhub.resources.Messages.Help.CfInclude);
    		expect(stdout).to.contain(fnhub.resources.Messages.Help.CfDeploy);
    		expect(stdout).to.contain(fnhub.resources.Messages.Help.SamCreate);
    		expect(stdout).to.contain(fnhub.resources.Messages.Help.SamInclude);
    		expect(stdout).to.contain(fnhub.resources.Messages.Help.SamDeploy);
        done();
      });
    });
    it("Does not include the warning", function(done){
      this.timeout(64000);
      var command = fnhubPath + ' help';
      exec(command, {}, function(err, stdout, stderr) {
        expect(stdout).to.not.contain(fnhub.resources.Messages.Help.DefaultCommandWarning);
        done();
      });
    });
  });
});


describe("Successful Cycle", function(){
  var testName = 'test1001';
  var user = {
    fullName: "relly",
    username:"testfnshub0001@backand.io",
    password:"123456",
    firstname:"firstname"
  };
  var module = {
    "Description":"this is a test description",
    "Metadata":{
      "Name":testName,
      "Version":"1.1.1",
      "Repo":"https://github.com/test/fnhub",
      "Keywords":["key1","key2","key3"],
      "License":"MIT",
      "Authors":[{Name: user.fullName, Email: user.username, Url:null}]
    }
  };
  var cwd = path.join(__dirname, testName);
  var cwdPublisher = path.join(cwd, "publisher");
  var cwdConsumer = path.join(cwd, "consumer");
  var moduleFile = path.join(cwdPublisher, fnhub.config.yamlFileName);
  var bin = path.join(path.dirname(__dirname), "bin");
  var fnhubPath = path.join(bin, "fnhub");

  var firstFunction = {
    "name": "fn-1",
    "handler": "index.handler1",
    "description": "first function description",
    "runtime": "nodejs4.3",
    "env": {}
  };

  var secondFunction = {
    "name": "fn-2",
    "handler": "index.handler2",
    "description": "second function description",
    "runtime": "nodejs4.3",
    "env": {}
  };

  describe("Publish module", function(){
    before(function(done){
      // if (fs.existsSync(cwd)) {
      //   deleteFolderRecursive(cwd);
      // }
      // fs.mkdirSync(cwd);
      // fs.mkdirSync(cwdPublisher);
      // fs.mkdirSync(cwdConsumer);
      //del.sync([moduleFile], {force:true});
      done();
    });
    after(function(done){
      // if (fs.existsSync(cwd)) {
      //   del.sync([cwd], {force:true});
      // }

      //del.sync([moduleFile], {force:true});

      done();
    });
    it("should signin", function (done){
      this.timeout(64000);
      var command = 'node ' + fnhubPath + ' signin --username "' + user.username + '" --password ' + user.password;
      exec(command, {cwd: cwdPublisher}, function(err, stdout, stderr) {
        if (stderr){
          console.error("command", command);
          console.error("stderr", stderr);
        }
        expect(!stderr).to.be.true;
        if (err) {
          console.error("command", command);
          console.error("err", err);
          console.error("stderr", stderr);
          console.error("stdout", stdout);
        }
        expect(err).to.be.null;

        //expect success message
        expect(stdout).to.contain(util.format(fnhub.resources.Messages.Signin.AfterSuccess,user.firstname));
        done();
      });
    });

    it("should init", function (done){
      this.timeout(64000);
      var command = 'node ' + fnhubPath + ' init --name "' + module.Metadata.Name + '" --authorEmail "' + module.Metadata.Authors[0].Email+ '" --authorName "' + module.Metadata.Authors[0].Name + '" --version ' + module.Metadata.Version + ' --description "' + module.Description + '" --repo ' + module.Metadata.Repo + ' --keywords "' + module.Metadata.Keywords + '" --license ' + module.Metadata.License;
      exec(command, {cwd: cwdPublisher}, function(err, stdout, stderr) {
        if (stderr){
          console.error("command", command);
          console.error("stderr", stderr);
        }
        expect(!stderr).to.be.true;
        if (err) {
          console.error("command", command);
          console.error("err", err);
          console.error("stderr", stderr);
          console.error("stdout", stdout);
        }
        expect(err).to.be.null;

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

    it("should add first function", function (done){
      this.timeout(64000);

      var command = 'node ' + fnhubPath + ' add --name ' + firstFunction.name + ' --description ' + firstFunction.description + ' --handler ' + firstFunction.handler + ' --runtime ' + firstFunction.runtime + ' --env {}';
      exec(command, {cwd: cwdPublisher}, function(err, stdout, stderr) {
        if (stderr){
          console.error("command", command);
          console.error("stderr", stderr);
        }
        expect(!stderr).to.be.true;
        if (err) {
          console.error("command", command);
          console.error("err", err);
          console.error("stderr", stderr);
          console.error("stdout", stdout);
        }
        expect(err).to.be.null;

        //check the file exists
        var doc = yaml.safeLoad(fs.readFileSync(fnhub.config.templates.module, 'utf8'));
        expect(doc).to.have.any.keys("Resources","Metadata","Description");
        done();
      });
    });

    it("should add second function", function (done){
      this.timeout(64000);

      var command = 'node ' + fnhubPath + ' add --name ' + secondFunction.name + ' --description ' + secondFunction.description + ' --handler ' + secondFunction.handler + ' --runtime ' + secondFunction.runtime + ' --env {}';
      exec(command, {cwd: cwdPublisher}, function(err, stdout, stderr) {
        if (stderr){
          console.error("command", command);
          console.error("stderr", stderr);
        }
        expect(!stderr).to.be.true;
        if (err) {
          console.error("command", command);
          console.error("err", err);
          console.error("stderr", stderr);
          console.error("stdout", stdout);
        }
        expect(err).to.be.null;


        //check the file exists
        var doc = yaml.safeLoad(fs.readFileSync(fnhub.config.templates.module, 'utf8'));
        expect(doc).to.have.any.keys("Resources","Metadata","Description");
        done();
      });
    });

    it("should publish", function (done){
      this.timeout(64000);

      var command = 'node ' + fnhubPath + ' publish';
      exec(command, {cwd: cwdPublisher}, function(err, stdout, stderr) {
        if (err) {
          console.error("command", command);
          console.error("err", err);
          console.error("stderr", stderr);
          console.error("stdout", stdout);
        }
        expect(err).to.be.null;


        //check the file exists
        expect(stdout).to.contain(util.format(fnhub.resources.Messages.Publish.AfterSuccess,''));
        done();
      });
    });

    it("should signout", function (done){
      this.timeout(64000);
      var command = 'node ' + fnhubPath + ' signout';
      exec(command, {cwd: cwdPublisher}, function(err, stdout, stderr) {
        if (stderr){
          console.error("command", command);
          console.error("stderr", stderr);
        }
        expect(!stderr).to.be.true;
        if (err) {
          console.error("command", command);
          console.error("err", err);
          console.error("stderr", stderr);
          console.error("stdout", stdout);
        }
        expect(err).to.be.null;

        //expect success message
        expect(stdout).to.contain('bye');
        done();
      });
    });
  });

  describe("Consume module with plugins", function(){
    describe("Include module in a new Cloud Formation stack and deploy it", function(){
      var CF = 'cf';
      var cwdConsumerCf = path.join(cwdConsumer, CF);
      var stackFile = path.join(cwdConsumerCf, cfPlugin.Consts.Defaults.Stack.FileName);
      var stack = {
        "AWSTemplateFormatVersion": "2010-09-09",
        "Description": "test stack 1001 description",
        "Metadata": {
          "Name": "testStackCF1001"
        },
        "Resources": {

        }
      }

      it("should create", function (done){
        this.timeout(64000);
        var command = 'node ' + fnhubPath + ' ' + CF + ' create --name "' + stack.Metadata.Name + '" --description "' + stack.Description + '"';
        exec(command, {cwd: cwdConsumerCf}, function(err, stdout, stderr) {
          if (stderr){
            console.error("command", command);
            console.error("stderr", stderr);
          }
          expect(!stderr).to.be.true;
          if (err) {
            console.error("command", command);
            console.error("err", err);
            console.error("stderr", stderr);
            console.error("stdout", stdout);
          }
          expect(err).to.be.null;

          //check the file exists
          fs.stat(stackFile, function(err, stats){
            expect(stats.isFile()).to.be.true;
            var doc = yaml.safeLoad(fs.readFileSync(stackFile, 'utf8'));
            //convert to JSON and compare
            var docString = JSON.stringify(doc);
            expect(docString).to.be.equal(JSON.stringify(stack));
            done();
          });
        });
      });

      it("should include", function (done){
        this.timeout(64000);

        var command = 'node ' + fnhubPath + ' ' + CF + ' include --module ' + module.Metadata.Name + ' --version ' + module.Metadata.Version;
        exec(command, {cwd: cwdConsumerCf}, function(err, stdout, stderr) {
          if (stderr){
            console.error("command", command);
            console.error("stderr", stderr);
          }
          expect(!stderr).to.be.true;
          if (err) {
            console.error("command", command);
            console.error("err", err);
            console.error("stderr", stderr);
            console.error("stdout", stdout);
          }
          expect(err).to.be.null;


          //check the file exists
          var doc = yaml.safeLoad(fs.readFileSync(stackFile, 'utf8'));
          expect(doc).to.have.any.keys("Resources","Metadata","Description");
          done();
        });
      });

      it("should deploy", function (done){
        this.timeout(6400000);

        var command = 'node ' + fnhubPath + ' ' + CF + ' deploy';
        exec(command, {cwd: cwdConsumerCf}, function(err, stdout, stderr) {
          if (stderr){
            console.error("command", command);
            console.error("stderr", stderr);
          }
          expect(!stderr).to.be.true;
          if (err) {
            console.error("command", command);
            console.error("err", err);
            console.error("stderr", stderr);
            console.error("stdout", stdout);
          }
          expect(err).to.be.null;


          //get the endpoints
          var json = stdout.slice(stdout.lastIndexOf('{'),stdout.lastIndexOf('}') + 1);
          expect(json.length > 0).to.be.true;
          var endpoints = JSON.parse(json).endpoints;
          expect(endpoints.length > 0).to.be.true;

          async.each(endpoints, function(endpoint, callback) {
            var options = {
              method: 'GET',
              url: endpoint
            };

            request(options, function (err, response, body) {
              if (err) {
                console.error("command", command);
                console.error("err", err);
                console.error("stderr", stderr);
                console.error("stdout", stdout);
              }
              expect(err).to.be.null;
              if (response.statusCode != 200){
                console.error("command", command);
                console.error("response.body", response.body);
              }
              expect(response.statusCode).to.equal(200);
              expect(body).to.contain('hi');
              callback();
            });
          }, function(err) {
            // if any of the file processing produced an error, err would equal that error
            expect(err).to.be.null;
            done();

          });
        });
      });

      it("should delete stack", function (done){
        this.timeout(6400000);

        var command = 'node ' + fnhubPath + ' ' + CF + ' delete';
        exec(command, {cwd: cwdConsumerCf}, function(err, stdout, stderr) {
          expect(!stderr).to.be.true;
          if (err) {
            console.error("command", command);
            console.error("err", err);
            console.error("stderr", stderr);
            console.error("stdout", stdout);
          }
          expect(err).to.be.null;


          //check the file exists
          expect(stdout).to.contain(cfPlugin.Messages.Delete.AfterSuccess,stack.Metadata.Name);
          done();
        });
      });
    });

    describe("Include module in a new SAM stack and deploy it", function(){
      var SAM = 'sam';
      var cwdConsumerSam = path.join(cwdConsumer, SAM);
      var stackFile = path.join(cwdConsumerSam, samPlugin.Consts.Defaults.Stack.FileName);
      var stack = {
        "AWSTemplateFormatVersion": "2010-09-09",
        "Transform": "AWS::Serverless-2016-10-31",
        "Description": "test stack sam 1002 description",
        "Metadata": {
          "Name": "testStackSam1002"
        },
        "Resources": {

        }
      }

      it("should create", function (done){
        this.timeout(64000);
        var command = 'node ' + fnhubPath + ' ' + SAM + ' create --name "' + stack.Metadata.Name + '" --description "' + stack.Description + '"';
        exec(command, {cwd: cwdConsumerSam}, function(err, stdout, stderr) {
          if (stderr){
            console.error("command", command);
            console.error("stderr", stderr);
          }
          expect(!stderr).to.be.true;
          if (err) {
            console.error("command", command);
            console.error("err", err);
            console.error("stderr", stderr);
            console.error("stdout", stdout);
          }
          expect(err).to.be.null;

          //check the file exists
          fs.stat(stackFile, function(err, stats){
            expect(stats.isFile()).to.be.true;
            var doc = yaml.safeLoad(fs.readFileSync(stackFile, 'utf8'));
            //convert to JSON and compare
            var docString = JSON.stringify(doc);
            expect(docString).to.be.equal(JSON.stringify(stack));
            done();
          });
        });
      });

      it("should include", function (done){
        this.timeout(64000);

        var command = 'node ' + fnhubPath + ' ' + SAM + ' include --module ' + module.Metadata.Name + ' --version ' + module.Metadata.Version;
        exec(command, {cwd: cwdConsumerSam}, function(err, stdout, stderr) {
          if (stderr){
            console.error("command", command);
            console.error("stderr", stderr);
          }
          expect(!stderr).to.be.true;
          if (err) {
            console.error("command", command);
            console.error("err", err);
            console.error("stderr", stderr);
            console.error("stdout", stdout);
          }
          expect(err).to.be.null;

          //check the file exists
          var doc = yaml.safeLoad(fs.readFileSync(stackFile, 'utf8'));
          expect(doc).to.have.any.keys("Resources","Metadata","Description");
          done();
        });
      });

      it("should deploy", function (done){
        this.timeout(6400000);

        var command = 'node ' + fnhubPath + ' ' + SAM + ' deploy';
        exec(command, {cwd: cwdConsumerSam}, function(err, stdout, stderr) {
          if (stderr){
            console.error("command", command);
            console.error("stderr", stderr);
          }
          expect(!stderr).to.be.true;
          if (err) {
            console.error("command", command);
            console.error("err", err);
            console.error("stderr", stderr);
            console.error("stdout", stdout);
          }
          expect(err).to.be.null;
          //get the endpoints
          var json = stdout.slice(stdout.lastIndexOf('{'),stdout.lastIndexOf('}') + 1);
          expect(json.length > 0).to.be.true;
          var endpoints = JSON.parse(json).endpoints;
          expect(endpoints.length > 0).to.be.true;

          async.each(endpoints, function(endpoint, callback) {
            var options = {
              method: 'GET',
              url: endpoint
            };

            request(options, function (err, response, body) {
              if (err) {
                console.error("command", command);
                console.error("err", err);
                console.error("stderr", stderr);
                console.error("stdout", stdout);
              }
              expect(err).to.be.null;
              if (response.statusCode != 200){
                console.error("command", command);
                console.error("response.body", response.body);
              }
              expect(response.statusCode).to.equal(200);
              expect(body).to.contain('hi');
              callback();
            });
          }, function(err) {
            // if any of the file processing produced an error, err would equal that error
            expect(err).to.be.null;
            done();

          });
        });
      });

      it("should delete stack", function (done){
        this.timeout(6400000);

        var command = 'node ' + fnhubPath + ' ' + SAM + ' delete';
        exec(command, {cwd: cwdConsumerSam}, function(err, stdout, stderr) {
          if (err) {
            console.error("command", command);
            console.error("err", err);
            console.error("stderr", stderr);
            console.error("stdout", stdout);
          }
          expect(err).to.be.null;


          //check the file exists
          expect(stdout).to.contain(samPlugin.Messages.Delete.AfterSuccess,stack.Metadata.Name);
          done();
        });
      });
    });

  });

  describe("Delete module", function(){
    it("should signin", function (done){
      this.timeout(64000);
      var command = 'node ' + fnhubPath + ' signin --username "' + user.username + '" --password ' + user.password;
      exec(command, {cwd: cwdPublisher}, function(err, stdout, stderr) {
        if (stderr){
          console.error("command", command);
          console.error("stderr", stderr);
        }
        expect(!stderr).to.be.true;
        if (err) {
          console.error("command", command);
          console.error("err", err);
          console.error("stderr", stderr);
          console.error("stdout", stdout);
        }
        expect(err).to.be.null;

        //expect success message
        expect(stdout).to.contain(util.format(fnhub.resources.Messages.Signin.AfterSuccess,user.firstname));
        done();
      });
    });

    it("should delete", function (done){
      this.timeout(64000);

      var command = 'node ' + fnhubPath + ' delete --force true';
      exec(command, {cwd: cwdPublisher}, function(err, stdout, stderr) {
        if (err) {
          console.error("command", command);
          console.error("err", err);
          console.error("stderr", stderr);
          console.error("stdout", stdout);
        }
        expect(err).to.be.null;
        //check the file exists
        expect(stdout).to.contain(util.format(fnhub.resources.Messages.Delete.AfterSuccess,module.Metadata.Name));
        done();
      });
    });
  });

});
