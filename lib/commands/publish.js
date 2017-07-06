"use strict";

var config        =  require('../config');
var logger  		  = require('../logger');
var question      = require('readline-sync').question;
var publishHelper = require('../helpers/publish.js');
const Errors  		= require('../errors');
const Messages  	= require('../messages');

module.exports = function (options) {
    
  publishHelper.publish(function(err, response){
		if (err) {
      logger.debug.error(err);
      if (err.expected && err.message) {
        logger.error(err.message);
      }
      else {
        logger.error(Errors.General.Uexpected);
      }
      process.exit(1);
    }
		else {
      logger.success(Messages.Publish.AfterSuccess.replace('{{0}}', response.data));
      process.exit(0);
    }
	});
};