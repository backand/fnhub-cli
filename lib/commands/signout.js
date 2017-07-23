var question        = require('readline-sync').question;
var signoutHelper  	= require('../helpers/signout.js');

module.exports = function (options, fnhub) {
  signoutHelper.signout();
  fnhub.logger.debug.log("Signout end");
  fnhub.logger.success("bye");
  process.exit(0);
};