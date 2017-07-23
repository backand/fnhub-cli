var question        = require('readline-sync').question;
var signoutHelper  	= require('../helpers/signout.js');
var fnhub 			    = require('../fnhub');

module.exports = function (options) {
  signoutHelper.signout();
  fnhub.logger.debug.log("Signout end");
  fnhub.logger.success("bye");
  process.exit(0);
};