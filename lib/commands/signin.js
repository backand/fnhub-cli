"use strict";

var config =  require('../config');
var logger  		= require('../logger');
var question    = require('readline-sync').question;
var signinHelper  		= require('../helpers/signin.js');

module.exports = function (options) {

  //provide info if no options parameter and instruction for the wizard
  if(!options.username && !options.password){
    logger.log('Provide your username, password and app name to sign in. You can supply these as parameters to the call:')
        .log('backand signin --username joe.user@backand.com --password Password123\n'.blue)
        .log('Or you can complete the wizard below:\n');
  }

  var username = options.username || question('username: '.grey);
  var password = options.password || question('password: '.grey, {noEchoBack: true});
  
  
  
  if (!username || !password) {
  	logger.warn('Must input username and password');
  	return
  }

  signinHelper.signin(username, password, function(err, response){
		if (err) console.error(err);
		else console.log('Signin end', response.data);
	});
};