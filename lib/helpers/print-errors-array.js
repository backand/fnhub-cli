var _ 				= require('lodash');
var fnhub 		= require('../fnhub');

module.exports = function(errors, field) {
	_.forEach(errors, function(e) {
		fnhub.logger.error(e[field]);
	})
}