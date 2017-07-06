var git = require('git-state');
var exec = require('child_process').exec;
var fs = require('fs')
var path = require('path')

// Prevent from failing on windows
var nullPath = /^win/.test(process.platform) ? 'nul' : '/dev/null'

// Consider EOL as \n because either Windows or *nix, this escape char will be there
var EOL = /\r?\n/

module.exports.isOkStatus = isOkStatus;
module.exports.commit = commit;

function isGit (dir, cb) {
  fs.stat(path.join(dir, '.git'), function (err) {
    cb(!err) 
  })
}

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
                    logger.warn('Damaged git repo status in: ' + destFolder + ',  aborting');
                    callback(err);
                }
                else{
                    if (result.dirty.length > 0 && result.dirty[0].indexOf('module.yaml') == -1){ 
                        callback('Git repo has uncommitted changes: ' + destFolder + ',  aborting');
                    }
                    else{
                        callback();
                    }
                }
            })
        }
    });
}

// function isOkStatus(destFolder, callback){
//     git.isGit(destFolder, function (exists) {
//           if (!exists) {
//             callback();
//           }
//           else{
//             git.check(destFolder, function (err, result) {
//                 if (err) {
//                     logger.warn('Damaged git repo status in: ' + destFolder + ',  aborting');
//                     callback(err);
                        
//                     //process.exit(1);
//                 }
//                 else{
//                     if (result.dirty > 0){ 
//                         //logger.warn('Git repo has uncommitted changes: ' + destFolder + ',  aborting');
//                         callback('Git repo has uncommitted changes: ' + destFolder + ',  aborting');
//                         //process.exit(1);
//                     }
//                     else{
//                         callback();
//                     }
//                 }
                
//             })
//         }
//     });
// }

function commit(msg, callback){
    var path = require('path');
    var repoPath = path.resolve(process.env.REPO || (__dirname + '/.git'));
    
    var command = 'git add module.yaml';
    exec(command, function(err, stdout, stderr) {
        if (err)  callback(err, stdout, stderr);
        else {
            command = 'git commit -m"' + msg + '"';
            exec(command, function(err, stdout, stderr) {
                callback(err, stdout, stderr);
            });
        }
    });
    
}