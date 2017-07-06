"use strict";

var config =  require('../config');
var logger  		= require('../logger');
var question    = require('readline-sync').question;
var signoutHelper  		= require('../helpers/signout.js');

module.exports = function (options) {
  signoutHelper.signout();
  logger.debug.log("Signout end");
  logger.success("bye");
  process.exit(0);
};