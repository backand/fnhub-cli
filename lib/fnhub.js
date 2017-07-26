module.exports.info = require('./helpers/info');
module.exports.awscli = require('./awscli');
module.exports.readlineSync = require('readline-sync');
module.exports.async = require('async');
module.exports.yaml = require('js-yaml');
module.exports._ = require('lodash');
module.exports.logger = require('./logger');
module.exports.config =  require('./config');
module.exports.resources = require('./resources');

module.exports.Consts = {
    Validation: {
        Regex:{
            AlphanumericAndDashes: '^[a-zA-Z0-9-]+$'
        }
    },
    Version:{
        Latest: 'latest',
        ModuleSeperator: '@'
    },
    Lambda:{
        ModuleFunctionSeperator: '-'
    }
};
module.exports.getS3Bucket = function(codeUri){
    if (!codeUri) {
        return null;
    }
    return codeUri.split('/')[2];
};
module.exports.getS3Key = function(codeUri){
    if (!codeUri) {
        return null;
    }
    return codeUri.split('/')[3] + '/' + codeUri.split('/')[4];
};
