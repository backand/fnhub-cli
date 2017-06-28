var config = require('../config');
var backand = require('@backand/nodejs-sdk');
var async = require('async');
var yaml = require('js-yaml');
var fs   = require('fs');
var upload = require('./upload')

module.exports.publish = publish;

function getModuleFile(callback){
    // Get document, or throw exception on error 
    try {
        var moduleJson = yaml.safeLoad(fs.readFileSync(config.templates.module, 'utf8'));
        callback(null, moduleJson);
    } catch (e) {
        callback(e, null);
    }
   
}

function validateYaml(moduleJson, callback){
    callback(null, moduleJson);
}

function validateGit(moduleJson, callback){
    callback(null, moduleJson);
}


function startPublish(moduleJson, callback){
    var name = moduleJson.Metadata.Name;
    var version = moduleJson.Metadata.Version;
    var githubRepo = moduleJson.Metadata.Repo;
    
    backand.fn.post("publish", {name:name, version:version, githubRepo:githubRepo, status:'start'})
    .then(function(response){
        console.log("publish response", JSON.stringify(response.data.temporaryRole))
        var version = response.data.version;
        var temporaryRole = response.data.temporaryRole;
        var codeUri = response.data.version.host + response.data.version.code;
        callback(null, moduleJson, version, temporaryRole, codeUri)
    })
    .catch(function(err){
        callback(err, null);
    });
}

function zip(moduleJson, version, temporaryRole, codeUri, callback){
    callback(null, moduleJson, version, temporaryRole, codeUri);
}

function updateLinkToCode(moduleJson, version, temporaryRole, codeUri, callback){
    callback(null, version, temporaryRole);
}

function uploadCodeToS3(version, temporaryRole, callback){
    var target = version.code;
    var source = config.codeZipFileName;
    uploadToS3(source, target, version, temporaryRole, callback);
}

function uploadYamlToS3(version, temporaryRole, callback){
    var target = version.deployment;
    var source = config.yamlFileName;
    uploadToS3(source, target, version, temporaryRole, callback);
}

function uploadToS3(source, target, version, temporaryRole, callback){
    var credentials = temporaryRole;
    credentials = { ResponseMetadata: { RequestId: 'ae2eeb93-5c02-11e7-9122-73ad5b338323' },
  Credentials: 
   { AccessKeyId: 'ASIAJAG3N6U67TO5WZNQ',
     SecretAccessKey: 'gDj3bDu+MYY9ImvLxJ6SHi+NSCwKc3Av7zfbl9Bf',
     SessionToken: 'FQoDYXdzEF4aDJr3ta3iVv40uOgJoiKzA9GKKaCb3rAKzJ6PsXE9gFa1BtzYMxUZ79HNX6C3hfAa4ieBbCfbo1Retl3yYW8wQWdST6HgyIs6sRFWANDYsxysA4l1SwK39sznKwb2bOweS1Lyv3rbNrxC/7omuHgcRmTGRok7rsxJdwXVeJjFdWwUPhS7l/TuDZ0e38amD/mWThml/rziesFBB+ogUgw3d9RVvIxU0+MQ7u4nNyAkzSdvpAdH8xL/xICVnx6mn5wmRb8xAyFp4dqcvhV65mFVU9wzLsZJUjsZKHndxXHK56OMK9gqR2tEh0XVtEYQZUfPkbCFvTOu4Jz7rjlqRcKdUQ6T5e4SclHTniV9rnwh7SZl/EwAWAIHT5pR8KheJh119lGtbifJLTfx78oeDYzDgksZHOaIxXFLM4ZAfWgxik5UkcAwoFvynLgxcsxRa313NbKmesh/cTIGxs35lDXutvA1hXolrmuvhsZEPuBKWQwCHQACoEaQZoJeZ+JV1yBR9eemv5Cp3cVSpdBIPrimX/+VC0KocP1zzz11dbd5KZeFUyJXEtdV/MaVuIoQDs2b6qlJJo/nt+XXvzMJUzmNRPY04Sj4087KBQ==',
     Expiration: '2017-06-28T14:07:04.000Z' },
  AssumedRoleUser: 
   { AssumedRoleId: 'AROAJPMTGYY5RYUHVVEFE:7adf9',
     Arn: 'arn:aws:sts::328923390206:assumed-role/hosting/7adf9' },
  PackedPolicySize: 54 };
    var bucket = version.bucket;
    var folder = version.folder;
    // credentials.info = { 
    //     "bucket": bucket,
    //     "dir": folder
    // };
    upload.upload(credentials, bucket, folder, target, source, (err) => {
        if (err)
            callback(err, null);
        else
            callback(null, version)
    });
    
}

function endPublish(version, callback){
    backand.fn.post("publish", {versionId:version.__metadata.id, status:'end'})
    .then(function(response){
        callback(null, response)
    })
    .catch(function(err){
        callback(err, null);
    });
}


function publish(publishCallback){
    async.waterfall([
        getModuleFile,
        validateYaml,
        validateGit,
        startPublish,
        zip,
        updateLinkToCode,
        uploadToS3,
        endPublish,
    ], publishCallback);
}