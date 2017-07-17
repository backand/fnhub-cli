"use strict";

var config        =  require('../config');
var logger  		  = require('../logger');
var question      = require('readline-sync').question;
var deleteHelper = require('../helpers/delete.js');
var Errors  		= require('../errors');
var Messages  	= require('../messages');

module.exports = function (options) {
    
  deleteHelper.delete(function(err, response){
		if (err) {
      logger.debug.error(err);
      if (err.expected && err.message) {
        logger.error(err.message);
      }
      else {
        logger.error(Errors.General.Unexpected);
      }
      process.exit(1);
    }
		else {
      logger.success(Messages.Delete.AfterSuccess.replace('{{0}}', response.codeUri));
      process.exit(0);
    }
	});
};