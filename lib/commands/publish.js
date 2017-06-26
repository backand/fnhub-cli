"use strict";

var config =  require('../config');
var logger  		= require('../logger');
var question    = require('readline-sync').question;
var publishHelper  		= require('../helpers/publish.js');

module.exports = function (options) {
  if (!options.module)
    options.module = 'test21';
 

  //provide info if no options parameter and instruction for the wizard
  if(!options.module){
    logger.log('Please provide the module name in order to publish it\n'.blue)
        .log('Or you can complete the wizard below:\n');
  }

  var module = options.module || question('module: '.grey);
  
  
  if (!module) {
    logger.warn('Must input module');
  	return
  }

  publishHelper.publish(module, "1.0.0", function(err, response){
		if (err) {
      console.error(err);
      process.exit(1);
    }
		else {
      console.log('Publish end', response.data);
      process.exit(0);
    }
	});
};