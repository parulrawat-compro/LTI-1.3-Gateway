const { getValidator } = require('../helpers/validator');

const oidcSchema = {
  properties: {
    client_id: {
      type: 'string'
    },
    redirect_uri: {
      type: 'string'
    },
    login_hint: {
      type: 'string'
    },
    nonce: {
      type: 'string'
    },
    prompt: {
      type: 'string',
      const: 'none'
    },
    response_type: {
      type: 'string',
      const: 'id_token'
    },
    response_mode: {
      type: 'string',
      const: 'form_post'
    },
    scope: {
      type: 'string',
      const: 'openid'
    }
  },
  required: [
    'client_id',
    'redirect_uri',
    'login_hint',
    'nonce',
    'prompt',
    'response_type',
    'response_mode',
    'scope'
  ]
};

module.exports = {
  oidcValidator: getValidator(oidcSchema)
};
