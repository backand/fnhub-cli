var question      = require('readline-sync').question;
var deleteHelper  = require('../helpers/delete.js');
var fnhub 				= require('../fnhub');

module.exports = function (options) {
    
  deleteHelper.delete(function(err, response){
		if (err) {
      fnhub.logger.debug.error(err);
      if (err.expected && err.message) {
        fnhub.logger.error(err.message);
      }
      else {
        fnhub.logger.error(fnhub.resources.Errors.General.Unexpected);
      }
      process.exit(1);
    }
		else {
      fnhub.logger.success(fnhub.resources.Messages.Delete.AfterSuccess,response.moduleName);
      process.exit(0);
    }
	});
};