const tools = require('../docs/tools.json');

module.exports = {
  validateRegistration: (registration, toolParams) => {
    // check redirect_uris against query params
    if (!registration.redirect_uris.includes(toolParams.redirect_uri)) {
      throw new Error('Unregistered redirect_uri');
    }
    return true;
    // checks in future
    // check issuer of platfrom against tool.json
    // get tool by deployment ID
  },

  findRegistrationsByToolUrl: (toolUrl) => {
    const tool = tools.find((toolItem) => toolItem.tool_url === toolUrl);
    return tool.registrations;
  }
};
