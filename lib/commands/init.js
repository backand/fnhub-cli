var backand = require('@backand/nodejs-sdk')
var config =  require('../config');
var logger  		= require('../logger');
var question    = require('readline-sync').question;
var initHelper  = require('../helpers/init.js');

module.exports = function(options){

	if (!options)

	var details = {};
	
	// interact and collect module details

	initHelper(details, function(err, response){
		if (err) console.error(err);
		else console.log('Module ready', response.data);
	});
}