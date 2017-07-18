var exec = require('child_process').exec;
var fs = require('fs')
var path = require('path')
var logger = require('../logger');
var Errors = require('../errors');

// Prevent from failing on windows
var nullPath = /^win/.test(process.platform) ? 'nul' : '/dev/null'

// Consider EOL as \n because either Windows or *nix, this escape char will be there
module.exports.isOkStatus = isOkStatus;
module.exports.commit = commit;
module.exports.getOriginUrl = getOriginUrl;

function isGit (dir, cb) {
  fs.stat(path.join(dir, '.git'), function (err) {
    cb(!err) 
  })
}

var EOL = /\r?\n/

function truthy (obj) {
  return !!obj
}

function status (repo, opts, cb) {
  exec('git status -s', {cwd: repo, maxBuffer: opts.maxBuffer}, function (err, stdout, stderr) {
    if (err) return cb(err)
    var status = { dirty: [], untracked: 0 }
    stdout.trim().split(EOL).filter(truthy).forEach(function (file) {
      if (file.substr(0, 2) === '??') status.untracked++
      else status.dirty.push(file);
    })
    cb(null, status)
  })
}

function isOkStatus(destFolder, callback){
    isGit(destFolder, function (exists) {
        if (!exists) {
            callback();
        }
        else {
            status(destFolder, {}, function (err, result) {
                if (err) {
                    callback({message:Errors.Git.DamagedGitRepo.replace('{{0}}',destFolder), expected:true});
                }
                else{
                    if (result.dirty.length > 0 && result.dirty[0].indexOf('module.yaml') == -1){ 
                        callback({message:Errors.Git.GitRepoHasUncommittedChanges.replace('{{0}}',destFolder), expected:true});
                    }
                    else{
                        callback();
                    }
                }
            })
        }
    });
}


function commit(msg, repo, callback){
    var path = require('path');
    var repoPath = path.resolve(process.env.REPO || (__dirname + '/.git'));
    
    var command = 'git add module.yaml -f';
    exec(command, {cwd: repo}, function(err, stdout, stderr) {
        if (err)  callback(err, stdout, stderr);
        else {
            command = 'git commit -m"' + msg + '"';
            exec(command, function(err, stdout, stderr) {
                callback(err, stdout, stderr);
            });
        }
    });
    
}

function getOriginUrl(destFolder, callback){
    isGit(destFolder, function (exists) {
        exec('git config --get remote.origin.url', function(err, stdout, stderr) {
            callback(err, stdout.replace('\n',''), stderr);
        });
    });
}