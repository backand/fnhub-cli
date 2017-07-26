var _         = require('lodash');
var Joi       = require('joi');

var fnhub 		= require('../fnhub');

var schema = Joi.object().keys({
	'Description': Joi.string().required(),
  'Metadata' : Joi.object(
    {
      'Name': Joi.string().regex(/[a-zA-Z0-9-](\w)*/).required(),
      'Authors': Joi.array().items(Joi.object({
          'Name': Joi.string().allow(null),
          'Email': Joi.string().email().required(),
          'Url': Joi.string().allow(null).uri({
            scheme: ['https', 'http']
          })
      })),
      'Repo': Joi.string().uri({
        scheme: ['https']
      }).required(),
      'Version': Joi.string().regex(/[0-9]+\.[0-9]+\.[0-9]+/).required(),
      'License': Joi.string().required(),
      'Keywords': Joi.array().optional().items(Joi.string()),
    }
  ).required(),
  'Resources': Joi.object().pattern(
    /[a-zA-Z0-9-](\w)*/,
    {
      'Type': Joi.string().valid('AWS::Serverless::Function').required(),
      'Properties' : Joi.object().keys({
        'Description': Joi.string().required(),
        'Handler': Joi.string().regex(/[a-zA-Z]+\.[a-zA-Z]+/).required(),
        'Runtime': Joi.string().valid(fnhub.config.aws.runtime).required(),
        'CodeUri': Joi.string().required(),
        'Environment': Joi.object().optional().keys({
          'Variables': Joi.object().optional()
        }).optional()
      })
    }
  ).required()
});

module.exports = function(data){
  var result = Joi.validate(data, schema);
  fnhub.logger.debug.log(result.error ? result.error.details : []);
	return {
		flag: result.error != null,
		errors: result.error ? result.error.details : []
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
    "Repo": "https://github.com/relly/fnhub",
    "Keywords": [
      "66"
    ],
    "License": "mit"
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
          "Variables": 'xx'
        }
      }
    }
  }
};


