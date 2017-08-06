
module.exports = function(options, fnhub){
		var command = options["_"][0];
		if(!!!command)
		{
			fnhub.logger.warn(fnhub.resources.Messages.Help.DefaultCommandWarning);
		}
		fnhub.logger.log(fnhub.resources.Messages.Help.HelpIntro);
		fnhub.logger.log(fnhub.resources.Messages.Help.Init);
		fnhub.logger.log(fnhub.resources.Messages.Help.Add);
		fnhub.logger.log(fnhub.resources.Messages.Help.Delete);
		fnhub.logger.log(fnhub.resources.Messages.Help.Info);
		fnhub.logger.log(fnhub.resources.Messages.Help.Who);
		fnhub.logger.log(fnhub.resources.Messages.Help.Publish);
		fnhub.logger.log(fnhub.resources.Messages.Help.Signin);
		fnhub.logger.log(fnhub.resources.Messages.Help.Signout);
		fnhub.logger.log(fnhub.resources.Messages.Help.Version);
		fnhub.logger.log(fnhub.resources.Messages.Help.VersionMajor);
		fnhub.logger.log(fnhub.resources.Messages.Help.VersionMinor);
		fnhub.logger.log(fnhub.resources.Messages.Help.VersionPatch);
		fnhub.logger.log(fnhub.resources.Messages.Help.CfCreate);
		fnhub.logger.log(fnhub.resources.Messages.Help.CfInclude);
		fnhub.logger.log(fnhub.resources.Messages.Help.CfDeploy);
		fnhub.logger.log(fnhub.resources.Messages.Help.SamCreate);
		fnhub.logger.log(fnhub.resources.Messages.Help.SamInclude);
		fnhub.logger.log(fnhub.resources.Messages.Help.SamDeploy);
		process.exit(0);
}
