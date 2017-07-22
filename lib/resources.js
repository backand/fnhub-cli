var colors = require('ansi-256-colors');
module.exports.buildQuestion = buildQuestion;

module.exports.Messages = {
    Signin:{
        AfterSuccess: 'Hello %s',
        Instructions: colors.fg.getRgb(5,1,0) + 'Provide your username and password to sign in. You can supply these as parameters to the call: fnhub signin --username joe.user@domain.com --password Password123\n' + colors.reset + 'Or you can complete the wizard below:\n',
        RequiredFields: 'Must input username and password'
    },
    Signup:{
        AfterSuccess: 'Welcome %s'
    },
    Publish:{
        AfterSuccess: 'The module was succefully published. It can be found at %s',
        StartValidation: 'Validating module...',
        EndValidation: 'Module is valid',
        StartRepositoryChecking: 'Checking repository...',
        EndRepositoryChecking: 'Repository is OK',
        StartZip:'Zipping module folder...',
        EndZip:'Module zip file is ready',
        StartUpload:'Uploading module to repository...',
        EndUpload:'Module uploaded'
    },
    Init:{
        AfterSuccess: 'The %s module was created succefully'
    },
    Function:{
        AfterSuccess: 'The function \'%s\' was added succefully'
    },
    Delete:{
        AfterSuccess: 'The module \'%s\' was deleted succefully'
    },
    Add:{
        Instructions: colors.fg.getRgb(5,1,0) + 'Please provide the function name, the function handler, the runtime, and optionally the environment variables, in order to add it\n' + colors.reset + 'Or you can complete the wizard below:\n',
        FileError: 'Can\'t load file \'%s\' or it doesn\'t exist',
        QuestionRequired: '%s is required',
        QuestionIsMust: 'Must enter a %s',
        EnvMustBeJSON: 'Environment Variables should be a valid JSON'
    },
    Info:{
        Instructions: colors.fg.getRgb(5,1,0) + 'Please provide the module name, in order to include it\n' + colors.reset + 'Or you can complete the wizard below:\n',
    }
}

module.exports.Errors = {
    General:{
        Unexpected:'An unexpected error occured. Please contact the fnhub team',
        FailedToSaveYamlFile: 'Failed to save yaml file'
    },
    Git:{
        DamagedGitRepo: 'Git repository %s is damage and needs repair',
        GitRepoHasUncommittedChanges: 'Git repo %s has uncommitted changes'
    },
    Publish:{
        NotAnUpgradeError:'Please update the module version. Do so using the following command: fnhub version [ patch | minor | major ]'
    },
    Cf: {
        Delete: {
            InProgress: 'Deletion is under way, please try again in few minutes'
        },
        Deploy: {
            MissingStack: 'Missing stack %s, please check the name of the stack and try the deploy again',
            MissingOrIncomprehensiveOutputsOfStack: 'The outputs section of stack %s is either missing or does not contain a valid endpoint description'
        }
    }
}


module.exports.Questions = {
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
  },
  Info:{
      Module: buildQuestion('module', false),
      Version: buildQuestion('version', true)
  },
  Signin:{
      Username: buildQuestion('username', false),
      Password: buildQuestion('password', false)
  },
  Cf:{
    Create:{
        Name: buildQuestion('stack name', true),
        Description: buildQuestion('description', false),
    },
    Include:{
        Module: buildQuestion('module', false),
        Version: buildQuestion('version', true)
    },
    Deploy:{
        Name: buildQuestion('stack name', true)
    },
    Delete:{
        Name: buildQuestion('stack name', true)
    }
  }
}

function buildQuestion (text, defaultInput){
  if(defaultInput){
    return colors.fg.getRgb(5,1,0) + text + ' ' + colors.reset + '($<defaultInput>): '.gray;
  } else {
    return colors.fg.getRgb(5,1,0) + text + ': ' + colors.reset;
  }
   
}