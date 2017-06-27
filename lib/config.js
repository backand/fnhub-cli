var storage    =     require('../lib/helpers/storage.js');
storage.init('.backandCache.json');

module.exports = {
    backand:{
      appName: 'funhub',
      signUpToken:'ccf8dfb2-1d5e-4f23-98c3-ae5bef9a2971',
      externalStorage: storage
    },
    codeZipFileName: 'module.zip',
    templates:{
        function: 'function.yaml',
        module: 'module.yaml'
    },
    analytics:{
      //key: 'BDCFyVrRyqjnGE4Cu1xe5ziPErtcPkHj', //test
      key: 'B9HnYlGFEZGQ99PkivFxE4kK4M8PKk3B', //prod
      anonymousId: 'cli@backand.io'
    }
};
