const platformService = require('../services/platform.service');
const { initiateLoginParamsValidator } = require('../validators/initiate-login.validator');

function renderErrorPage(res, errorMsg) {
  return res.render('error.hbs', {
    pageTitle: 'Error',
    errorMsg
  });
}

module.exports = {

  initiateLogin(req, res) {
    const { session } = req;

    // Fetch params from URL
    const loginParams = {
      iss: req.query.iss,
      userId: req.query.userId,
      resLinkId: req.query.resLinkId,
      deploymentId: req.query.deploymentId
    };

    // Validate params
    const { valid, errorMsg } = initiateLoginParamsValidator(loginParams);
    if (!valid) renderErrorPage(res, `Initiate Login Params schema error - ${errorMsg}`);

    // get platform data corresponding to platform Id
    const platform = platformService.getPlatformByIssuer(loginParams.iss);
    if (!platform) {
      return renderErrorPage(res, `Platform with issuer name '${loginParams.iss}' not found`);
    }

    // Verify if user exists in platform
    // TBD - need to confirm
    // if (!platform.getUserById(loginParams.userId)) {
    //   return renderErrorPage(res, `userId '${loginParams.userId}' not found`);
    // }

    // Verify if resLinkId exists in platform
    // const resourceLink = platform.getResourceLinkbyId(loginParams.resLinkId);
    // if (!resourceLink) {
    //   return renderErrorPage(res, `ResourceLink with resLinkId '${loginParams.resLinkId}' not found`);
    // }

    // Get Registration by DeploymentId
    const registration = platform
      .getRegistrationbyDeploymentId(loginParams.deploymentId);
    if (!registration) {
      return renderErrorPage(res, `Deployment with deploymentId '${loginParams.deploymentId}' not found`);
    }

    // Create initiateLogin's Request Object
    const initiateLoginReqParams = {
      iss: platform.iss,
      // TBD - if userid there check - need to discuss
      login_hint: loginParams.userId,
      lti_message_hint: loginParams.resLinkId,

      target_link_uri: registration.toolLaunchUrl,
      client_id: registration.clientId,

      lti_deployment_id: loginParams.deploymentId
    };

    // Update session
    session.userId = loginParams.userId;
    session.resLinkId = loginParams.resLinkId;

    // send response page
    return res.render('response-page.hbs', {
      pageTitle: 'Initiate login',
      responseParams: initiateLoginReqParams,
      loginParams: JSON.stringify(initiateLoginReqParams, null, 4),
      action: registration.toolLoginInitUrl
    });
  }
};
