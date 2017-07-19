"use strict";
var logger   = require('./logger');
var fs = require('fs');


module.exports = {
  getCommand: function(commandName, subCommand){
    if (fs.existsSync(__dirname + '/commands/' + commandName + '.js')) {
      return require('./commands/' + commandName);
    } else{
      return null;
    }
  }

};