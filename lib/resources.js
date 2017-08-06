var colors = require('ansi-256-colors');
module.exports.buildQuestion = buildQuestion;

module.exports.Messages = {
    General: {
        Yes:'y',
        No:'n'
    },
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
        AfterSuccess: 'The %s module was created succefully',
        NameValid:'Module name can only be alphanumeric with hyphen.'
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
        EnvMustBeJSON: 'Environment Variables should be a valid JSON',
        NameValid:'Module name can only be alphanumeric with hyphen.'
    },
    Info:{
        Instructions: colors.fg.getRgb(5,1,0) + 'Please provide the module name, in order to include it\n' + colors.reset + 'Or you can complete the wizard below:\n',
    },
    Who:{
        NoUser: "no user logged in"
    },
    Help:{
      DefaultCommandWarning: "No command specified, displaying the help page. You can access this content by using the following command: fnhub help\n",
      HelpIntro: "This is the help page for fnhub. The fnhub CLI supports the following commands:\n",
      Init: colors.fg.getRgb(5,1,0) + "fnhub init: This initializes a fnhub module.\n" + colors.reset + "\nArguments: \n"
            + "\t --name - string - the module's name (required, default: current directory)\n"
            + "\t --authorEmail - string - email for the module author (required, default: currently authenticated user)\n"
            + "\t --authorName - string - the module author's name (optional, default: currently authenticated user's name)\n"
            + "\t --version - string - the module version (required, default: 1.0.0)\n"
            + "\t --repo - string - the module's github repo (required, default: local github file ID if present)\n"
            + "\t --keywords - string - a space delimited string of search keywords for this repo (optional, default: module name)\n"
            + "\t --license - string - the module's license (optional, default ISC)\n",
      Add: colors.fg.getRgb(5,1,0) + "fnhub add: Adds a function to the current module.\n" + colors.reset + "\nArguments: \n"
            + "\t --name - string - the function's name (required, default: current module name)\n"
            + "\t --description - string - a description of the function (required, default: none)\n"
            + "\t --runtime - string - the runtime environment for the function (required, default: none)\n"
            + "\t --handler - string - the function's entry point (required, default: index.handler)\n"
            + "\t --license - JSON string - environment variables for the function, described in JSON (optional, default {})\n",
      Delete: colors.fg.getRgb(5,1,0) + "fnhub delete: Deletes a module.\n" + colors.reset + "\nArguments: \n"
            + "\t --description - string - the module to delete (optional, default: pulled from module.yml)\n",
      Info: colors.fg.getRgb(5,1,0) + "fnhub info: Provides information on a specific module.\n" + colors.reset + "\nArguments: \n"
            + "\t --name - string - the module's name (required, default: none)\n"
            + "\t --version - string - the module version (optional, default: latest)\n",
      Who: colors.fg.getRgb(5,1,0) + "fnhub who: Provides details on the currently authenticated user.\n" + colors.reset + "\nno arguments\n",
      Publish: colors.fg.getRgb(5,1,0) + "fnhub publish: Publishes the module to fnhub.io.\n" + colors.reset + "\nno arguments\n",
      Signin: colors.fg.getRgb(5,1,0) + "fnhub signin: Authenticates the user with fnhub.io.\n" + colors.reset + "\nArguments: \n"
            + "\t --username - string - the username to authenticate (required, default: none)\n"
            + "\t --password - string - the user's password (required, default: none)\n",
      Signout: colors.fg.getRgb(5,1,0) + "fnhub signout: Ends the current user's session.\n" + colors.reset + "\nno arguments\n",
      Signup: colors.fg.getRgb(5,1,0) + "fnhub signup: Creates an account on fnhub.io.\n" + colors.reset + "\nArguments: \n"
            + "\t --firstname - string - the user's first (given) name (required, default: none)\n"
            + "\t --lastname - string - the user's last (family) name (required, default: none)\n"
            + "\t --username - string - the user's desired username, formatted as an email address (required, default: none)\n"
            + "\t --password - string - the user's desired password (required, default: none)\n"
            + "\t --confirm - string - the user's password, for confirmation. Must match the --password argument (required, default: none)\n",
      Version: colors.fg.getRgb(5,1,0) + "fnhub version: Retrieves the module's version from module.yaml.\n" + colors.reset + "\nno arguments\n",
      VersionMajor: colors.fg.getRgb(5,1,0) + "fnhub version major: Increments the module's major version in module.yaml.\n" + colors.reset + "\nno arguments\n",
      VersionMinor: colors.fg.getRgb(5,1,0) + "fnhub version minor: Increments the module's minor version in module.yaml.\n" + colors.reset + "\nno arguments\n",
      VersionPatch: colors.fg.getRgb(5,1,0) + "fnhub version patch: Increments the module's patch version in module.yaml.\n" + colors.reset + "\nno arguments\n",
      CfCreate: colors.fg.getRgb(5,1,0) + "fnhub cf create: Creates a new AWS CloudFormation stack file in fnhub-stack.yaml.\n" + colors.reset + "\nArguments: \n"
            + "\t --name - string - the stack name (required, default: none)\n"
            + "\t --description - string - the stack's description (required, default: none)\n",
      CfInclude: colors.fg.getRgb(5,1,0) + "fnhub cf include: Adds a module in the fnhub-stack.yaml stack definition file in the local directory.\n" + colors.reset + "\nArguments: \n"
            + "\t --module - string - the name of the module to include (required, default: none)\n"
            + "\t --version - string - the module version to include (required, default: latest)\n",
      CfDeploy: colors.fg.getRgb(5,1,0) + "fnhub cf deploy: Uses the AWS CLI to deploy your stack to AWS Cloud Formation.\n" + colors.reset + "\nno arguments\n",
      SamCreate: colors.fg.getRgb(5,1,0) + "fnhub sam create: Creates a new AWS SAM stack file in fnhub-stack.yaml.\n" + colors.reset + "\nArguments: \n"
            + "\t --name - string - the stack name (required, default: none)\n"
            + "\t --description - string - the stack's description (required, default: none)\n",
      SamInclude: colors.fg.getRgb(5,1,0) + "fnhub sam include: Adds a module in the fnhub-stack.yaml stack definition file in the local directory.\n" + colors.reset + "\nArguments: \n"
            + "\t --module - string - the name of the module to include (required, default: none)\n"
            + "\t --version - string - the module version to include (required, default: latest)\n",
      SamDeploy: colors.fg.getRgb(5,1,0) + "fnhub sam deploy: Uses the AWS CLI to deploy your stack to AWS SAM.\n" + colors.reset + "\nno arguments\n"
    }
}

module.exports.Errors = {
    General:{
        Unexpected:'An unexpected error occured. Please contact the fnhub team',
        FailedToSaveYamlFile: 'Failed to save yaml file'
    },
    Init: {
        NoRepo: 'You must have a github repository to publish your function'
    },
    Git:{
        DamagedGitRepo: 'Git repository %s is damage and needs repair',
        GitRepoHasUncommittedChanges: 'Git repo %s has uncommitted changes'
    },
    Delete: {
        NotFound: 'The module \'%s\' was not found',
        ModuleYamlNotFoundOrCorrupted: 'The module.yaml file was either not found or corrupted',
        AuthenticationIsRequired: 'Please run \'fnhub signin\' before the delete command'
    },
    Publish:{
        NotAnUpgradeError:'Please update the module version. Do so using the following command: fnhub version [ patch | minor | major ]',
        BelongToSomeoneElseError:'Please use a different name for the module, it is already taken.',
        AuthenticationIsRequired: 'Please run \'fnhub signin\' before the publish command'
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
    AuthorEmail: buildQuestion('author email', true),
    AuthorEmailNo: buildQuestion('author email', false),
    AuthorName: buildQuestion('author name', true),
    AuthorNameNo: buildQuestion('author name', false),
    Version: buildQuestion('version', true),
    Description: buildQuestion('description', false),
    GitRepo: buildQuestion('git repository', true),
    Keywords: buildQuestion('keywords', true),
    License: buildQuestion('license', true)
  },
  Add:{
    Name: buildQuestion('name', true),
    NameValid: buildQuestion('Module name can only be alphanumeric with hyphen.', true),
    Description: buildQuestion('description', true),
    Handler: buildQuestion('function handler', true),
    Runtime: buildQuestion('Select runtime to use?', false),
    Env: buildQuestion('environment variables', false),
  },
  Delete:{
    AreYouSure: buildQuestion('This will permanently delete the module and allow others to use its name. Continue delete [y/n]?', true)
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
