"use strict";
var config = require('./config');

function isObject(obj) {
  return obj === Object(obj);
}

function toString(obj) {
  return isObject(obj) ? JSON.stringify(obj) : obj;
}

module.exports = {
  log: function(message) {
    console.log(message);
    return this;
  },

  newline: function() {
    return this.log("\n");
  },

  success: function (message) {
    return this.log('✔ '.green + message.green);
  },

  error: function (message) {
    return this.log('X '.red + message.red);
  },

  warn: function (message) {
    return this.log('⚠ '.yellow + message.yellow);
  },

  debug: {
    log: function (message, json) {
      if (!config.log.debug) return this;

      if (json)
        message = toString(message) + ': ' + toString(json);

      if (message.indexOf('X ') == 0){
        return this.log('DEBUG>> '.blue + message.red);
      }
      else {
        return this.log('DEBUG>> '.blue + '✔ '.green + message.white);
      }
    },

    error: function (message, json) {
      return this.log('X ' + message);
    }
  }
};
