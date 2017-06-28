var _ = require('lodash');
var logger = require('../logger');

module.exports = function(errors) {
	_.forEach(errors, (e) => {
		logger.error(e);
	})
}