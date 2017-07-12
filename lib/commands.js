"use strict";
var logger   = require('./logger');
var fs = require('fs');


module.exports = {
  getCommand: function(commandName, subCommand){
    if (fs.existsSync(__dirname + '/commands/' + commandName + '.js')) {
      return require('./commands/' + commandName);
    }
    else{
      try {
        return require('./plugins/' + commandName + '/commands/' + subCommand);
      }
      catch (err){
        logger.warn(err.toString());
        process.exit(1);
      }
    }
  }

};