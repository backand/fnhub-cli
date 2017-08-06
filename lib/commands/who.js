var question    = require('readline-sync').question;
var whoHelper  	= require('../helpers/who.js');

module.exports = function (options, fnhub) {
  whoHelper.who(fnhub, function(err, response){
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
      fnhub.logger.success(response.user);
      process.exit(0);
    }
  });
};