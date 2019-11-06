const Router = require('express').Router();
const appConfig = require('config').get('app');

const HomeRoutes = require('./home.routes');
const PlatformsRoute = require('./platforms.routes');
const GatewayRoute = require('./gateway.routes');

Router.use('/home', HomeRoutes);
Router.use('/platforms', PlatformsRoute);
Router.use('/gateway', GatewayRoute);

Router.get('/', (req, res) => res.render('index', {
  title: appConfig.title
}));

module.exports = Router;
