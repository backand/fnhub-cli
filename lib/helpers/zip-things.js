var archiver    = require('archiver');
var fs          = require('fs');
var _           = require('lodash');

var fnhub 		= require('../fnhub');

function zipDirectory(directory, targetZipFile, callback) {
    
    // append files from a directory
    files = _.difference(fs.readdirSync(directory), fnhub.config.ignoreFiles);

    // create a file to stream archive data to.
    targetZipFullPath = require('path').join(process.cwd(), targetZipFile);
    var output = fs.createWriteStream(targetZipFullPath);
    var archive = archiver('zip', {
        store: true // Sets the compression method to STORE.
    });

    // listen for all archive data to be written
    output.on('close', function() {
        clearInterval(interval);
        process.stderr.write("\n");
        callback(null);
    });

    // good practice to catch this error explicitly
    archive.on('error', function(err) {
        clearInterval(interval);
        process.stderr.write("\n");
        callback(err);
    });

    // pipe archive data to the file
    var interval = setInterval(function(){
        process.stderr.write('=');
    }, 1000);
    archive.pipe(output);

    _.forEach(files, function(file) {
        if (fs.statSync(file).isDirectory()) {
          archive.directory(file, '/' + file);
        }
        else {
          archive.file(file, { name: file});
        }
    });

    // finalize the archive (ie we are done appending files but streams have to finish yet)
    archive.finalize();
}

module.exports.zipDirectory = zipDirectory;