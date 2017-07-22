"use strict";
var util    = require('util');
var config  = require('./config');

function isObject(obj) {
  return obj === Object(obj);
}

function toString(obj) {
  var s = isObject(obj) ? JSON.stringify(obj, null, 2) : obj;
  if (s == "{}" && obj.toString() != 'undefined')
      return obj.toString();
  else
      return s;
}

module.exports = {
  toString: toString,

  log: function(message) {
    console.log(message);
    return this;
  },

  newline: function() {
    return this.log("\n");
  },

  success: function (message, params) {
    params = params || '';
    return this.log('✔ '.green + util.format(message, params).green);
  },

  error: function (message, params) {
    params = params || '';
    return this.log('X '.red + util.format(message, params).red);
  },

  warn: function (message, params) {
    params = params || '';
    return this.log('⚠ '.yellow + util.format(message, params).yellow);
  },

  debug: {
    log: function (message, json) {
      if (!config.debug.log) return this;

      message = toString(message);

      if (json)
        message = message + ': ' + toString(json);

      if(message){
        if (message.indexOf('X ') == 0){
          console.log('DEBUG>> '.blue + message.red + ' <<DEBUG'.blue);
          return this;
        }
        else {
          console.log('DEBUG>> '.blue + '✔ '.green + message.white + ' <<DEBUG'.blue);
          return this;
        }
      }
    },

    error: function (message, json) {
      return this.log('X ' + toString(message), json);
    }
  }
};
