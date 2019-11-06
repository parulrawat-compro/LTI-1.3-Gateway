const platformKeys = require('../config/platform.keys.json');

module.exports = {
  findPlatformKeysByClientId: (clientId) => platformKeys
    .find((key) => key.client_id === clientId)
};
