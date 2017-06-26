var backand = require('@backand/nodejs-sdk')
var config =  require('../config');
var logger  		= require('../logger');
var question    = require('readline-sync').question;
var addHelper  		= require('../helpers/add.js');

module.exports = function(option){
	// interact and collect function details

	addHelper(options.functionName, options.envVars, function(err, response){
		if (err) console.error(err);
		else console.log('Function added', response.data);
	});
}