var v = require('validate-obj'); 
v.register('isVersion', 
	function(value) {
		return value.match(/[0-9].[0-9].[0-9]/) != null;
	}
);

var validationExpression = {
	'AWSTemplateFormatVersion': [v.required, v.isIn(['2010-09-09'])],
	'Transform': [v.required, v.isIn(['AWS::Serverless-2016-10-31'])], 
	'Metadata': [v.required],
	'Metadata.Name': [v.required, v.isString],
	'Metadata.Author': [v.isString],
	'Metadata.Repo': [v.required, v.isUrl],
	'Metadata.Version': [v.required, v.isVersion],
	'Metadata.Entrypoint': [v.required, v.isString],
	'Metadata.License': [v.required, v.isIn(['ISC', 'MIT'])],
	'Metadata.Keywords': [[v.isString]],
	
};


module.exports = function(data, resourcesRequired){
	if (resourcesRequired){
		validationExpression.Resources = [v.required];
	}
	var errs = v.hasErrors(data, validationExpression);
	return {
		flag: errs != null,
		errors: errs
	};
}