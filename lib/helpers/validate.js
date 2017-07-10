var _ = require('lodash');
var config =  require('../config');
var Joi = require('joi');

var schema = Joi.object().keys({
  'AWSTemplateFormatVersion': Joi.string().valid('2010-09-09').required(),
	'Transform': Joi.string().valid('AWS::Serverless-2016-10-31').required(),  
	'Description': Joi.string().optional(),
  'Metadata' : Joi.object(
    {
      'Name': Joi.string().required(),
      'Author': Joi.string().optional(),
      'Repo': Joi.string().uri({
        scheme: ['https']
      }).required(),
      'Version': Joi.string().regex(/[0-9]+\.[0-9]+\.[0-9]+/).required(),
      'Entrypoint': Joi.string().required(),
      'License': Joi.string().required(),
      'Keywords': Joi.array().optional().items(Joi.string()),
    }
  ).required(),
  'Resources': Joi.object().pattern(
    /[a-zA-Z](\w)*/,
    {
      'Type': Joi.string().valid('AWS::Serverless::Function').required(),
      'Properties' : Joi.object().keys({
        'Handler': Joi.string().regex(/[a-zA-Z]+\.[a-zA-Z]+/).required(),
        'Runtime': Joi.string().valid(config.nodeRuntimes).required(),
        'CodeUri': Joi.string().uri({
          scheme: ['s3']
        }).required(),
        'Environment': Joi.object().optional().keys({
          'Variables': Joi.object().optional()
        }).optional()
      })
    }
  ).optional()
});

module.exports = function(data){
  var result = Joi.validate(data, schema);
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
    "Entrypoint": "index.js",
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


