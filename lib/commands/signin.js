var question      = require('readline-sync').question;
var signinHelper  = require('../helpers/signin.js');

module.exports = function (options, fnhub) {

  //provide info if no options parameter and instruction for the wizard
  if(!options.username && !options.password){
      fnhub.logger.log(fnhub.resources.Messages.Signin.Instructions);
  }

  var username = options.username || question(fnhub.resources.Questions.Signin.Username);
  var password = options.password || question(fnhub.resources.Questions.Signin.Password, {noEchoBack: true});
  
  if (!username || !password) {
    fnhub.logger.warn(fnhub.resources.Messages.Signin.RequiredFields);
    return
  }

  signinHelper.signin(username, password, function(err, response){
    if (err) {
      fnhub.logger.debug.error(err);
      if (err.data && err.data.error_description) {
        fnhub.logger.error(err.data.error_description);
      }
      else {
        fnhub.logger.error(fnhub.resources.Errors.General.Unexpected);
      }
      process.exit(1);
    }
		else {
      fnhub.logger.success(fnhub.resources.Messages.Signin.AfterSuccess,response.data.firstName);
      process.exit(0);
    }
	});
};