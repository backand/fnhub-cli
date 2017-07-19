"use strict";
var logger   = require('./logger');
var fs = require('fs');


module.exports = {
  getCommand: function(commandName, subCommand){
    if (fs.existsSync(__dirname + '/commands/' + commandName + '.js')) {
      return require('./commands/' + commandName);
    } else{
      logger.warn('can\'t find command ' + commandName);
      return null;
    }
  }

};