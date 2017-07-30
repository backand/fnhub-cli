var storage    =     require('../lib/helpers/storage.js');
storage.init('.backandCache.json');

module.exports = {
    backand:{
      appName: 'funhub',
      signUpToken:'ccf8dfb2-1d5e-4f23-98c3-ae5bef9a2971',
      externalStorage: storage
    },
    codeZipFileName: 'module.zip',
    yamlFileName: 'module.yaml',
    ignoreFiles: ['.git', '.gitignore', '.DS_Store', '.vscode', 'idea'],
    templates:{
        function: 'function.yaml',
        module: 'module.yaml',
        fnhubSam: '',
        providers:{
          aws: {
            template:'fnhub-sam.yaml',
            module: 'module.yaml'
          }
        }
    },
    analytics:{
      //key: 'BDCFyVrRyqjnGE4Cu1xe5ziPErtcPkHj', //test
      key: 'B9HnYlGFEZGQ99PkivFxE4kK4M8PKk3B', //prod
      anonymousId: 'cli@domain.io'
    },
    debug:{
      log: false
    },
    git:{
      forceCommit: true
    },   
    aws:{
      s3:{
        host: 'https://s3.amazonaws.com/',
        bucket:'fnhub.backand.io'
      },
      runtime: ['nodejs4.3', 'nodejs6.10', 'Edge Node.js 4.3','Python 2.7', 'Python 3.6','Java 8','C#'],
      defaultHandler: ['index.handler','index.handler','index.handler','lambda_function.lambda_handler','lambda_function.lambda_handler','com.Hello::myHandler','MyApp::Example.Hello::MyHandler']
    }
};
