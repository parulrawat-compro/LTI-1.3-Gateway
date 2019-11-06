// require tools.json
const Tools = require('../docs/tools.json');

class ToolRegistration {
  constructor() {
    this.toolUrl = '';
    this.name = '';
    this.clientId = '';
    this.platformKeys = {};
    this.deployments = [];

    this.toolLoginInitUrl = '';
    this.toolLaunchUrl = '';
    this.toolDeepLinkUrl = '';
    this.toolRedirectUrl = [];
    this.toolKeys = {};
  }

  initFromJson(json) {
    this.toolUrl = json.tool_url;
    this.name = json.name;
    this.clientId = json.client_id;
    this.platformKeys = json.platform_keys;
    this.deployments = json.deployments;
    this.populateToolData();
  }

  populateToolData() {
    const tool = Tools.find((t) => t.tool_url === this.toolUrl);
    const registration = tool.registrations.find((r) => r.client_id === this.clientId);

    this.toolLoginInitUrl = registration.login_initiation_url;
    this.toolLaunchUrl = registration.launch_url;
    this.toolDeepLinkUrl = registration.deep_link_url;
    this.toolRedirectUrl = registration.redirect_uris;
    this.toolKeys = registration.keys;
  }
}

module.exports = ToolRegistration;
