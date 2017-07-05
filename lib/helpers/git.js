var git = require('git-state');
var exec = require('child_process').exec;

module.exports.isOkStatus = isOkStatus;
module.exports.commit = commit;

function isOkStatus(destFolder, callback){
    git.isGit(destFolder, function (exists) {
          if (!exists) {
            callback();
          }
          else{
            git.check(destFolder, function (err, result) {
                if (err) {
                    logger.warn('Damaged git repo status in: ' + destFolder + ',  aborting');
                    callback(err);
                        
                    //process.exit(1);
                }
                else{
                    if (result.dirty > 0){ 
                        //logger.warn('Git repo has uncommitted changes: ' + destFolder + ',  aborting');
                        callback('Git repo has uncommitted changes: ' + destFolder + ',  aborting');
                        //process.exit(1);
                    }
                    else{
                        callback();
                    }
                }
                
            })
        }
    });
}

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