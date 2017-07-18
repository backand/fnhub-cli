'use strict';
exports.handler1 = (event, context, callback) => {
	console.log('Event:', JSON.stringify(event));
	const name = event.name || 'hi1';
	const response = {event: event, context:context};
	callback(null, response);
};

exports.handler2 = (event, context, callback) => {
	console.log('Event:', JSON.stringify(event));
	const name = event.name || 'hi2';
	const response = {event: event, context:context};
	callback(null, response);
};