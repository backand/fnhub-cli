var v = require('validate-obj'); 
var _ = require('lodash');

v.register('isVersion', 
	function(value) {
		return value.match(/[0-9].[0-9].[0-9]/) != null;
	}
);

var validationExpression = {
	'AWSTemplateFormatVersion': [v.required, v.isIn(['2010-09-09'])],
	'Transform': [v.required, v.isIn(['AWS::Serverless-2016-10-31'])], 
	'Metadata' : {
		'Name': [v.required, v.isString],
		'Author': [v.isString],
		'Repo': [v.required, v.isUrl],
		'Version': [v.required, v.isVersion],
		'Entrypoint': [v.required, v.isString],
		'License': [v.isString],
		'Keywords': [[v.isString]],
	}
};


module.exports = function(data, resourcesRequired){
	console.log("vvvvv");
	console.log(JSON.stringify(data));
	if (resourcesRequired){
		validationExpression.Resources = [v.required];
	}
	var errs = _.filter(v.hasErrors(data, validationExpression), function(a){
		return a != true;
	});
	console.log(errs);

	return {
		flag: errs.length > 0,
		errors: errs
	};
}

var d = {
  "AWSTemplateFormatVersion": "2010-09-09",
  "Transform": "AWS::Serverless-2016-10-31",
  "Description": "description",
  "Metadata": {
    "Name": "init001",
    "Author": "relly",
    "Version": "1.0.110",
    "Entrypoint": "index.js",
    "Repo": "https://github.com/relly/fnhub",
    "Keywords": [
      "backand"
    ],
    "License": "mit",
    "Defaultauthor": "testfnshub0001@backand.io"
  },
  "Resources": {
    "first": {
      "Type": "AWS::Serverless::Function",
      "Properties": {
        "Handler": "index.foo",
        "Runtime": "nodejs4.3",
        "CodeUri": "s3://bucket/zipfile",
        "Environment": {
          "Variables": {
            "key1": "val1",
            "two": "wwwww"
          }
        }
      }
    },
    "two": {
      "Type": "AWS::Serverless::Function",
      "Properties": {
        "Handler": "index.hhh",
        "Runtime": "nodejs6.10",
        "CodeUri": "s3://bucket/zipfile",
        "Environment": {
          "Variables": ""
        }
      }
    }
  }
};

// console.log(f(d, false));