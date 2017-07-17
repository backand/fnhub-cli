module.exports = function(moduleName){
	try {
      var plugin = require('./' + moduleName + '/index');
      return plugin.getCommand;
    }
    catch (err){
      return null;
    }
}