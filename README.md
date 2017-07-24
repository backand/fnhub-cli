# fnhub
## Puplisher Commands
### signin
required step before publishing a module. presistent cookie 
#### example:
fnhub signin --username someone@somewhere.com --password 123456
#### options:
##### username
description: signed up username   
type: string  
validation: not necessarily an email  
default:   
required: true
##### password
description: signed up user's password   
type: string  
validation:   
default:   
required: true
### init
creates a module.yaml file in the working directory that holds all the necessary information about the module
#### example:
fnhub init --name hi --authors relly --version 1.0.110 --description "module description" --repo", "https://github.com/relly/fnhub" --keywords "hello world", --license mit
#### options:
##### name
description: The module global unique name to be published   
type: string  
validation: alphanumeric, dashes  
default: current folder name  
required: true
##### author (deprecated)
remark: Currently it is an email, but it is going to be changed into the following:
##### authors
description: The module authors   
type: [{name:"string", email:"string",url:"string"}]  
validation: email format on email, url format on url  
default: current signed in user  
required: false
##### version
description: The module version    
type: string   
validation: according to http://semver.org/  
default: 1.0.0  
required: true
##### description
description: The module description    
type: string   
validation:   
default:   
required: true
##### repo (git repository)
description: The module git repository    
type: string   
validation: url  
default: read from github file id such exists  
required: true 
##### keywords
description: The keywords that will help users to find the module    
type: string   
validation: space delimited words  
default: module name  
required: false 
##### license
description: The module license    
type: string   
validation:   
default: ISC  
required: false 
### add
adds a function to the module, there could be several functions in a single module. This is aws best prectise to have a single source code with multiple starting points handlers
#### example:
fnhub add --name "hi1" --description "function description" --handler index.handler1 --runtime nodejs4.3 --env "{}"
#### options:
##### name
description: The function name that you want to add to the module, it can be more than one although we expect it will be usually one   
type: string  
validation: alphanumeric, dashes  
default: current module name   
required: true
##### description
description: The function description    
type: string   
validation:   
default:   
required: true
##### runtime
description: The run time envirunmnet of the function type: string   
validation: select one from list  
default:   
required: true
##### handler
description: The function starting point  
type: string   
validation:   
default: index.handler   
required: true
##### env (environment variables)
description: The environment variables for the lambda function  
type: JSON   
validation: valid JSON   
default: {}   
required: false
### publish
If first time then creates a unique namespace (returns an error if already taken) otherwize upgrades a version then zip and uploads to global storage (s3).   
#### example:
fnhub publish 
#### options:
no options
### version 
gets the version in the module.yaml file
#### example:
fnhub version  
#### options:
no options
### version major
upgrades the major version segment in the module.yaml file
#### example:
fnhub version major 
#### options:
no options
### version minor
upgrades the minor version segment in the module.yaml file
#### example:
fnhub version minor 
#### options:
no options
### version patch
upgrades the patch version segment in the module.yaml file
#### example:
fnhub version patch 
#### options:
no options

### delete
deletes the module and its entire versions and clears the global storage
#### example:
fnhub delete 
#### options:
##### module
description: The module name to be deleted with its entire versions  
type: string   
validation: if not supplied then it is taken from module.yaml    
default:   
required: false


## General Commands
### info
gets the information about the module
#### example:
fnhub info 
#### options:
##### module
description: The module name   
type: string   
validation: 
default:   
required: true
##### version
description: The module version   
type: string   
validation: 
default: latest  
required: false
### who
gets the information about the current signed in user
#### example:
fnhub who 
#### options:
no options

## Consumer Plugins Commands
### cf (cloud formation plugin)
#### create
creates a fnhub-stack.yaml file in the working directory that holds all the necessary information about the stack
##### example
fnhub cf create --name stack001 --description "stack description"
##### options
###### name
description: The stack name   
type: string   
validation: alphanumeric, dashes
default:   
required: true
###### description
description: The function description    
type: string   
validation:   
default:   
required: true
#### include
adds a module to the fnhub-stack.yaml file in the working directory. there could be several modules in a stack
##### example
fnhub cf include --module hi --version 1.0.0
##### options
###### module
description: The module name   
type: string   
validation: alphanumeric, dashes
default:   
required: true
###### version
description: The module version    
type: string   
validation: semver  
default: latest  
required: false
#### deploy
uses aws cli to deploy a cloud formation yaml file to the consumer aws account
##### example
fnhub cf deploy
##### options
no options

### SAM (SAM plugin)
exactly the same as cf only replace the second argument "cf" with "sam"

