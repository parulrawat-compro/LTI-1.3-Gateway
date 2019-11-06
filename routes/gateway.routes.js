const Router = require('express').Router();
const initiateLoginController = require('../controllers/initiate-login.controller');
const OidcController = require('../controllers/oidc.controller');

Router.get('/initiate-login', initiateLoginController.initiateLogin);

Router.get('/platforms/:platformId/oidc', OidcController.handleOidcRequest);

module.exports = Router;
