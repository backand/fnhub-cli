var git = require('git-state');


module.exports.isOkStatus = isOkStatus;

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