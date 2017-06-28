var git = require('git-state');
var _ = require('underscore');

function isOkStatus(destFolder, callback){
    git.isGit(destFolder, function (exists) {
          if (!exists) {
            callback();
          }
          else{
            git.check(destFolder, function (err, result) {
                if (err) {
                    logger.warn('Damaged git repo status in: ' + destFolder + ',  aborting');
                    process.exit(1);
                }
                else{
                    // console.log(result) 
                    // => { branch: 'master', 
                    //      ahead: 0, 
                    //      dirty: 9, 
                    //      untracked: 1, 
                    //      stashes: 0 } 
                    var changes = _.reduce(
                        _.filter(
                            _.values(result), (v) => { return v; }
                        ),
                        (memo, num) => { return memo + num; }, 0
                    );
                    if (changes > 0){ 
                        logger.warn('Git repo has uncommitted changes: ' + destFolder + ',  aborting');
                        process.exit(1);
                    }
                    else{
                        callback();
                    }
                }
                
            })
        }
    });
}