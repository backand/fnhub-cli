"use strict";

var config =  require('../config');
var logger  		= require('../logger');
var question    = require('readline-sync').question;
var publishHelper  		= require('../helpers/publish.js');

module.exports = function (options) {
    
  publishHelper.publish(function(err, response){
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