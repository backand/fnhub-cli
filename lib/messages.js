module.exports = {
    Signin:{
        AfterSuccess: 'Hello {{0}}'
    },
    Signup:{
        AfterSuccess: 'Welcome {{0}}'
    },
    Publish:{
        AfterSuccess: 'The module was succefully published. It can be found at {{0}}',
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
        AfterSuccess: 'The {{0}} module was created succefully'
    },
    Function:{
        AfterSuccess: 'The function \'{{0}}\' was added succefully'
    },
    Delete:{
        AfterSuccess: 'The module \'{{0}}\' was deleted succefully'
    }
}
