var colors = require('ansi-256-colors');

function buildQuestion (text, defaultInput){
  if(defaultInput){
    return colors.fg.getRgb(5,1,0) + text + ' ' + colors.reset + '($<defaultInput>): '.gray;
  } else {
    return colors.fg.getRgb(5,1,0) + text + ': ' + colors.reset;
  }
   
}

module.exports = {
  Init:{
    Name: buildQuestion('name', true),
    Author: buildQuestion('author', true),
    AuthorNo: buildQuestion('author', false),
    Version: buildQuestion('version', true),
    Description: buildQuestion('description', false),
    GitRepo: buildQuestion('git repository', true),
    Keywords: buildQuestion('keywords', true),
    License: buildQuestion('license', true)
  },
  Add:{
    Name: buildQuestion('name', true),
    Description: buildQuestion('description', true),
    Handler: buildQuestion('function handler', true),
    Runtime: buildQuestion('Select runtime to use?', false),
    Env: buildQuestion('environment variables', false),
  }

}