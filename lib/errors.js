module.exports = {
    General:{
        Unexpected:'An unexpected error occured. Please contact the fnhub team',
        FailedToSaveYamlFile: 'Failed to save yaml file'
    },
    Git:{
        DamagedGitRepo: 'Damaged git repo status in: {{0}}',
        GitRepoHasUncommittedChanges: 'Git repo has uncommitted changes: {{0}}'
    },
    Publish:{
        NotAnUpgradeError:'Please upgrade the module version. You can run: fnhub version [ patch | minor | major ]'
    },
    Cf: {
        Delete: {
            InProgress: 'Delete is in progress, please try again within few minutes'
        },
        Deploy: {
            MissingStack: 'Missing stack {{0}}, please check the stack name or try to deploy again',
            MissingOrIncomprehensiveOutputsOfStack: 'The outputs section of the stack {{0}} is either missing or does not contain a valid endpoint description'
        }
    }
}