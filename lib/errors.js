module.exports = {
    General:{
        Unexpected:'An unexpected error occured. Please contact the fnhub team',
        FailedToSaveYamlFile: 'Failed to save yaml file'
    },
    Git:{
        DamagedGitRepo: 'Git repository {{0}} is damage and needs repair',
        GitRepoHasUncommittedChanges: 'Git repo {{0}} has uncommitted changes'
    },
    Publish:{
        NotAnUpgradeError:'Please update the module version. Do so using the following command: fnhub version [ patch | minor | major ]'
    },
    Cf: {
        Delete: {
            InProgress: 'Deletion is under way, please try again in few minutes'
        },
        Deploy: {
            MissingStack: 'Missing stack {{0}}, please check the name of the stack and try the deploy again',
            MissingOrIncomprehensiveOutputsOfStack: 'The outputs section of stack {{0}} is either missing or does not contain a valid endpoint description'
        }
    }
}
