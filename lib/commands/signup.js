"use strict";

var question        = require('readline-sync').question;
var signupHelper  	= require('../helpers/signup.js');

module.exports = function (options, fnhub) {

    //provide info if no options parameter and instruction for the wizard
    if(!options.username && !options.password){
        fnhub.logger.log('Provide your first name, last name, username, password and password confirmation to sign up. You can supply these as parameters to the call:')
            .log('backand signup --firstname john --lastname doe --username john.doe@backand.com --password Password123 --confirm Password123\n'.blue)
            .log('Or you can complete the wizard below:\n');
    }

    var firstname = options.firstname || question('firstname: '.grey);
    var lastname = options.lastname || question('lastname: '.grey);
    var username = options.username || question('email username: '.grey);
    var password = options.password || question('password: '.grey, {noEchoBack: true});
    var confirm = options.confirm || question('confirm: '.grey, {noEchoBack: true});
    
  
  
    if (!firstname || !lastname || !username || !password || !confirm) {
        fnhub.logger.warn('Must input firstname, lastname, username, password and confirm');
        return
    }

    signupHelper.signup(firstname, lastname, username, password, confirm, function(err, response){
        if (err) {
            fnhub.logger.debug.error(err);
            if (err.data && err.data.error_description) {
                fnhub.logger.error(err.data.error_description);
            }
            else {
                fnhub.logger.error(fnhub.Errors.General.Unexpected);
            }
            process.exit(1);
        }
        else {
            fnhub.logger.success(fnhub.resources.Messages.Signup.AfterSuccess,response.data.firstName);
            process.exit(0);
        }
	});
};