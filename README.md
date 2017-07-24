# fnhub

This repo is the Command-Line Interface for [fnhub.io](fnhub.io). It can be used to easily publish, share, and consume open-source serverless functions for deployment on platforms like AWS Lambda, Microsoft Azure Functions, or Google Cloud Functions. Below is a reference list for all of the commands in the CLI. They are divided into three areas - General commands, Publisher commands, and Consumer commands.


## General Commands

General commands are used to get more details on a fnhub.io package.

### info
The `info` command provides informaiton on a specific module.
#### Example
`fnhub info`
#### Options and Parameters
| name (**bold** fields are **required**) | description | type | validation | default value |
| --------------------------------------- | ----------- | ---- | ---------- | ------------- |
| **module** | The name of the module for which you are requesting info | string | none | none |
| version | The module version to obtain information for | string | none | "latest" |

### who

Provides details on the currently authenticated user.

#### Example

`fnhub who`

#### Options and Parameters

This command has no options or parameters.

## Publisher Commands

These commands are intended to be used by module publishers. They consist of all of the commands necessary to upload a function module to fnhub.io, as well as maintain its information.

### signin
This authenticates the user with fnhub.io, using a persistent cookie to track authorization. Required prior to running any other publishing commands

#### Example
`fnhub signin --username someone@somewhere.com --password 123456`

#### Options and Parameters

| name (**bold** fields are **required**) | description | type | validation | default value |
| --------------------------------------- | ----------- | ---- | ---------- | ------------- |
| **username** | The user's registered username | string | supports email and plaintext | none|
| **password** | The registered user's password | string | none | none |

### init

The `init` command initializes a fnhub.io module. It creates a `module.yaml` file in the working directory. This file will hold all necessary information about the module being created.

#### Example
`fnhub init --name hi --authors relly --version 1.0.110 --description "module description" --repo", "https://github.com/relly/fnhub" --keywords "hello world", --license mit`

#### Options and Parameters

| name (**bold** fields are **required**) | description | type | validation | default value |
| --------------------------------------- | ----------- | ---- | ---------- | ------------- |
| **name** | The module's name, to be published. Must be globally unique | string | supports alphanumeric characters and dashes | Current working directory |
| authors | The module's authors | JSON array | Format must match `[{name: "string", email:"string", url:"string"}]` | information for the currently authenticated user |
| **version** | The module's version | string | validated per rules at http://semver.org | 1.0.0 |
| **description** | A description of the module | string | none | none |
| **repo** | The module's github repository | string | url | If a github file ID exists, this value is used |
| keywords | A list of keywords that users will use when searching for the module | string | Checks for a space-delimited string | The module's name |
| license | The module's license | string | none | ISC | 

### add
Adds a serverless function to the current module. Each module can support multiple functions.

**Note**: Many serverless function providers, as a part of their best practices, recommend having a single set of source code with multiple entry points when working with related functionality.

#### Example
`fnhub add --name "hi1" --description "function description" --handler index.handler1 --runtime nodejs4.3 --env "{}"``
#### Options and Parameters
| name (**bold** fields are **required**) | description | type | validation | default value |
| --------------------------------------- | ----------- | ---- | ---------- | ------------- |
| **name** | The function name to add to the module (this can include more than one function name) | string | supports alphanumeric characters and dashes | current module name |
| **description** | A description of the function | string | none | none |
| **runtime** | The run time environment for the function | string | must be one of 'nodejs4.3', 'nodejs6.10', 'Edge Node.js 4.3', 'Python 2.7', 'Python 3.6', 'Java 8', or 'C#' |
| **handler ** | The serverless function's entry point | string | none | `index.handler` |
| env | Environment variables for the function, defined in JSON | JSON | must be valid JSON | `{}` |

### publish
Publishes the module. If this is the first module you have published, FnHub.io first creates a unique namespace. This can return an error if the name requested is already taken. Once this is finished, the CLI updates your module's version then deploys the code to global storage (in AWS S3).

#### Example
`fnhub publish`

#### Options and Parameters

None

### version 
Retrieves the module version from `module.yml`

#### Example
`fnhub version`  
#### Options and Parameters

None

### version major

Increases the module's major version segment in `module.yml`

#### Example

`fnhub version major`

#### Options and Parameters

None

### version minor
Increases the module's minor version segment in `module.yml`

#### Example

`fnhub version minor`

#### Options and Parameters

None

### version patch
Increases the module's patch version segment in `module.yml`

#### Example

`fnhub version patch`

#### Options and Parameters
None

### delete
Deletes the module (all versions) and clears local storage
#### Example
`fnhub delete`
#### Options and Parameters
| name (**bold** fields are **required**) | description | type | validation | default value |
| --------------------------------------- | ----------- | ---- | ---------- | ------------- |
| description | The module name to delete | string | none | If none is provided, the name is pulled from `module.yml` |

## Consumer Plugins Commands

These commands are used by consumers seeking to leverage code published on fnhub.io in their own projects.

### cf (cloud formation plugin)

The functions below operate using our AWS CloudFormation plugin, `cf`

#### create
Creates a `fnhub-stack.yaml` file in the working directory. This file holds all necessary stack information
##### Example
`fnhub cf create --name stack001 --description "stack description"``
##### options and Parameters
| name (**bold** fields are **required**) | description | type | validation | default value |
| --------------------------------------- | ----------- | ---- | ---------- | ------------- |
| **name** | The name of the stack | string | supports alphanumeric characters and dashes | none |
| **description** | A description of the stack | string | none | none |

#### include
Adds a module to the `fnhub-stack.yml` file in the current working directory. A stack can include several modules.
##### Example

`fnhub cf include --module hi --version 1.0.0`

##### Options and Parameters
| name (**bold** fields are **required**) | description | type | validation | default value |
| --------------------------------------- | ----------- | ---- | ---------- | ------------- |
| **module** | The name of the module to include | string | supports alphanumeric characters and dashes | none |
| version | The version of the module to include | string | validated per rules at http://semver.org | latest |

#### deploy
Uses the AWS CLI to deploy a cloud formation yaml file to your AWS account

##### Example

`fnhub cf deploy`

##### Options and Parameters
None

### SAM (SAM plugin)
The SAM plugin operates in exactly the same way as our AWS CloudFormation plugin, but simply uses SAM instead of CloudFormation. Simply replace `cf` `sam` in any of the CloudFormation commands, and your code will be ready to go.
