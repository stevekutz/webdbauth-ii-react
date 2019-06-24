const router = require('express').Router();
const Users = require('./users-model');

// all code in restricted-middleware is called in here, there is no named function
const restrictedMW = require('../myMiddleware/myMiddleWare');
const myLogger2 = require('../myMiddleware/myMiddleware2');



// Used to test for restricted route middleware check       // routeCheck
 // const routeCheck = require('../myMiddleware/restrictedMiddleware');
 // router.get('/', myLogger2.myLogger2, routeCheck, restrictedMW, (req, res) => {


router.get('/', myLogger2.myLogger2, restrictedMW, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});


module.exports = router;