"use strict";

var config        =  require('../config');
var logger  		  = require('../logger');
var question      = require('readline-sync').question;
var signinHelper  = require('../helpers/signin.js');
var Errors  		= require('../errors');
var Messages  	= require('../messages');

module.exports = function (options) {

  //provide info if no options parameter and instruction for the wizard
  if(!options.username && !options.password){
      logger.log('Provide your username and password to sign in. You can supply these as parameters to the call:')
        .log('fnhub signin --username joe.user@domain.com --password Password123\n'.blue)
        .log('Or you can complete the wizard below:\n');
  }

  var username = options.username || question('username: '.grey);
  var password = options.password || question('password: '.grey, {noEchoBack: true});
  
  
  
  if (!username || !password) {
    logger.warn('Must input username and password');
    return
  }

  signinHelper.signin(username, password, function(err, response){
    if (err) {
      logger.debug.error(err);
      if (err.data && err.data.error_description) {
        logger.error(err.data.error_description);
      }
      else {
        logger.error(Errors.General.Unexpected);
      }
      process.exit(1);
    }
		else {
      logger.success(Messages.Signin.AfterSuccess.replace('{{0}}', response.data.firstName));
      process.exit(0);
    }
	});
};