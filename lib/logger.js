"use strict";
var config = require('./config');

function isObject(obj) {
  return obj === Object(obj);
}

function toString(obj) {
  var s = isObject(obj) ? JSON.stringify(obj) : obj;
  if (s == "{}" && obj.toString() != 'undefined')
      return obj.toString();
  else
      return s;
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
      if (!config.debug.log) return this;

      message = toString(message);

      if (json)
        message = message + ': ' + toString(json);

      if (message.indexOf('X ') == 0){
        console.log('DEBUG>> '.blue + message.red + ' <<DEBUG'.blue);
        return this;
      }
      else {
        console.log('DEBUG>> '.blue + '✔ '.green + message.white + ' <<DEBUG'.blue);
        return this;
      }
    },

    error: function (message, json) {
      return this.log('X ' + toString(message), json);
    }
  }
};
