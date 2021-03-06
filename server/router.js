const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);
  app.get('/getDays', mid.requiresLogin, controllers.Domo.getDays);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Domo.make);
  app.get('/prem', mid.requiresLogin, controllers.Domo.prem);
  app.get('/exercise', mid.requiresLogin, controllers.Domo.exercise);
  app.get('/exGraph', mid.requiresLogin, controllers.Domo.exGraph);
  app.get('/premium', mid.requiresLogin, controllers.Domo.premium);
  app.get('/getPremium', mid.requiresLogin, controllers.Domo.getPremium);
  app.get('/days', mid.requiresLogin, controllers.Domo.daysPage);
  app.get('/graphs', mid.requiresLogin, controllers.Domo.graphMaker);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('*', controllers.Domo.error);
};

module.exports = router;
