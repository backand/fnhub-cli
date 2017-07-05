var _ = require('lodash');
var logger = require('../logger');

module.exports = function(errors) {
	_.forEach(errors, function(e) {
		logger.error(e);
	})
}