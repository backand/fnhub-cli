'use strict';
exports.handler1 = (event, context, callback) => {
	const response = {
      statusCode: 200,
      headers: {
        "x-custom-header" : "My Header Value"
      },
      body: JSON.stringify({ "message": "hi1" })
    };
	
	callback(null, response);
};

exports.handler2 = (event, context, callback) => {
	const response = {
      statusCode: 200,
      headers: {
        "x-custom-header" : "My Header Value"
      },
      body: JSON.stringify({ "message": "hi2" })
    };
	
	callback(null, response);
};