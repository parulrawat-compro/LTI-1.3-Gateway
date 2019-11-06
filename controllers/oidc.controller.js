
const jwt = require('jsonwebtoken');
const jwtConfig = require('config').get('jwt');
const axios = require('axios');

const { oidcValidator } = require('../validators/oidc.validator');
const platformService = require('../services/platform.service');
const keysService = require('../services/keys.service');

function renderErrorPage(res, oidcParams, errorMsg) {
  return res.render('error.hbs', {
    pageTitle: 'Error',
    oidcParams,
    errorMsg
  });
}

async function generateIdToken(res, oidcParams, platform, registration) {
  // make api call
  const platformDetails = await axios.get(('https://lti-1-3-platform-poc.herokuapp.com/platform/getdata?userId=user-000-000-001&resLinkId=res-000-000-001'));

  // Generate payload
  const audience = platform.getAllRegisteredClientIds();
  // get user by id
  const { user } = platformDetails.data;
  // get resource link data
  const { resLink } = platformDetails.data;
  // get course
  const { course } = platformDetails.data;

  const payload = {
    iss: platform.iss,
    aud: audience,
    sub: user.id,
    azp: oidcParams.client_id,
    nonce: oidcParams.nonce,

    name: user.name,
    given_name: user.given_name,
    family_name: user.family_name,
    middle_name: user.middle_name,
    picture: user.picture,
    email: user.email,

    'https://purl.imsglobal.org/spec/lti/claim/message_type': 'LtiResourceLinkRequest',
    'https://purl.imsglobal.org/spec/lti/claim/version': '1.3.0',
    // session
    'https://purl.imsglobal.org/spec/lti/claim/deployment_id': resLink.deployment_id,
    'https://purl.imsglobal.org/spec/lti/claim/resource_link': {
      id: resLink.resource_link_id,
      description: resLink.description,
      title: resLink.title
    },
    'https://purl.imsglobal.org/spec/lti/claim/target_link_uri': registration.toolLaunchUrl,
    'https://purl.imsglobal.org/spec/lti/claim/context': {
      id: course.id,
      label: course.label,
      title: course.title
    },
    // Hard coded - TBD
    'https://purl.imsglobal.org/spec/lti/claim/roles': [
      'http://purl.imsglobal.org/vocab/lis/v2/institution/person#Student',
      'http://purl.imsglobal.org/vocab/lis/v2/membership#Learner',
      'http://purl.imsglobal.org/vocab/lis/v2/membership#Mentor'
    ]
  };

  // Key approach integrate with gitlab version - TBD
  const key = keysService.findPlatformKeysByClientId(oidcParams.client_id);
  if (!key) return renderErrorPage(res, oidcParams, 'Platform keys not found');

  // return signature
  return jwt.sign(payload, key.private_key, {
    algorithm: 'RS256',
    expiresIn: jwtConfig.expiry,
    keyid: key.kid
  });
}

module.exports = {

  handleOidcRequest: async (req, res) => {
    // Hard coded session values, need to be replaced - TBD
    req.session.userId = 'user-000-000-001';
    req.session.resLinkId = 'res-000-000-001';

    const oidcParams = { ...req.query };
    const { platformId } = req.params;

    // Validating params against OIDC schema
    const { valid, errorMsg } = oidcValidator(oidcParams);
    if (!valid) {
      return renderErrorPage(res, oidcParams, `OIDC Schema error - ${errorMsg}`);
    }

    // get platform data corresponsing to platform Id
    const platform = platformService.getPlatformById(platformId);

    // Check valid client id for this platform
    const registration = platform.getRegistrationByClientId(oidcParams.client_id);
    if (!registration) {
      return renderErrorPage(res, oidcParams, `Registration not found by client_id ${oidcParams.client_id}`);
    }

    // Check redirect uri is registered for this client id
    if (!registration.toolRedirectUrl.includes(oidcParams.redirect_uri)) {
      return renderErrorPage(res, oidcParams, `redirect_uri "${oidcParams.redirect_uri}" not registered`);
    }

    // check login hint
    if (req.session.userId !== oidcParams.login_hint) {
      return renderErrorPage(res, oidcParams, `User with userId '${oidcParams.login_hint}' is not logged in`);
    }

    // check lti message hint
    if (req.session.resLinkId !== oidcParams.lti_message_hint) {
      return renderErrorPage(res, oidcParams, `Resource with resLinkId '${oidcParams.lti_message_hint}' is not authrorized`);
    }

    // Generate id token
    const idToken = await generateIdToken(res, oidcParams, platform, registration);
    if (!idToken) {
      res.status(500).send({ Error: 'Error in generating id_token' });
    }

    // Response parameters
    const responseParams = {
      id_token: idToken,
      state: oidcParams.state
    };

    // Send back response using form post
    return res.render('form.hbs', {
      title: 'Sending launch request',
      responseParams,
      responseDisplayParams: JSON.stringify(responseParams, null, 4),
      action: oidcParams.redirect_uri,
      method: 'POST'
    });
  }
};
