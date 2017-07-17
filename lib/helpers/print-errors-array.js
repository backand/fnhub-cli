var _ = require('lodash');
var logger = require('../logger');

module.exports = function(errors, field) {
	_.forEach(errors, function(e) {
		logger.error(e[field]);
	})
}