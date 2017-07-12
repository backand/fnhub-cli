module.exports = function(moduleName){
	console.log('router');
	try {
      var plugin = require('./' + moduleName + '/index');
      return plugin.getCommand;
    }
    catch (err){
      return null;
    }
}