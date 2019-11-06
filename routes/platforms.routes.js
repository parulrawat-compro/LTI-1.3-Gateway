const Router = require('express').Router();
const OidcController = require('../controllers/oidc.controller');

Router.get('/:id/oidc', OidcController.handleOidcRequest);

// Router.get('/:platformId/resource_links/:resLinkId', initiateLoginController.initiateLogin);

module.exports = Router;
