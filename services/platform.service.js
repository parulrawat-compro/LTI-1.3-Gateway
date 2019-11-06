const platformsJson = require('../docs/platforms.json');
const Platform = require('../models/platform');

function initializeFromJson() {
  return platformsJson.map((platformJson) => {
    const platform = new Platform();
    platform.initFromJson(platformJson);
    return platform;
  });
}

class PlatformService {
  constructor() {
    this.platforms = initializeFromJson();
  }

  getPlatformById(platformId) {
    return this.platforms.find((platform) => platform.id === platformId);
  }
  
  getPlatformByIssuer(platformIssuer) {
    return this.platforms.find((platform) => platform.iss === platformIssuer);
  }
}

module.exports = new PlatformService();
