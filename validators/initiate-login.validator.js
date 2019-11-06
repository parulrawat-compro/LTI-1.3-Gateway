const { getValidator } = require('../helpers/validator');

const oidcSchema = {
  properties: {
    iss: {
      type: 'string'
    },
    userId: {
      type: 'string'
    },
    resLinkId: {
      type: 'string'
    }
  },
  required: [
    'iss',
    // TBD - req or not
    'userId',
    'resLinkId'
  ]
};

module.exports = {
  initiateLoginParamsValidator: getValidator(oidcSchema)
};
