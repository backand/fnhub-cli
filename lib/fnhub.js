module.exports.info = require('./helpers/info');
module.exports.readlineSync = require('readline-sync');
module.exports.async = require('async');
module.exports.yaml = require('js-yaml');
module.exports.logger = require('./logger');
module.exports.Errors = require('./errors');
module.exports.Messages = require('./messages');
module.exports.Consts = {
    Version:{
        Latest: 'latest',
        ModuleSeperator: '@'
    }
}
