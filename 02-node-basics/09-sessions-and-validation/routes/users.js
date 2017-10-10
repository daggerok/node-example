var express = require('express');
var router = express.Router();
const links = require('./index').links;
const users = {};

/* GET: users listing. */
router.get('/', (req, res, next) => {
  res.render('users/list', {
    title: 'List of users',
    links,
    users,
    success: req.session.success,
    errors: req.session.errors,
  });
});

/* GET: create new user. */
router.get('/new', (req, res, next) => {
  res.render('users/new', {
    title: 'Create new user',
    links,
    success: req.session.success,
    errors: req.session.errors,
  });
  req.session.errors = null;
});

/* GET: user info. */
router.get('/:username', (req, res, next) => {
    const username = req.params.username;
    const user = username ? users[username] : {};
    res.render('users/info', {
        title: 'User info',
        links,
        user,
    });
});

/* POST: create new user. */
router.post('/new/create', (req, res, next) => {
  req.check('username', 'Username is empty').notEmpty();
  req.check('username', 'Username is too short').isLength({ min: 3, });
  req.check('email', 'Email is empty').notEmpty();
  req.check('email', 'Email is invalid').isEmail();
  const errors = req.validationErrors();
  console.log('errors', errors);
  console.log('errors.length', errors.length);
  console.log('!!errors', !!errors);
  req.session.success = !!errors;
  console.log(req.session);
  console.log(req.body);
  if (!!errors) {
    req.session.errors = errors;
    res.redirect('/users/new/');
  } else {
    const username = req.body.username;
    const email = req.body.email;
    users[username] = {
      username,
      email,
    };
    res.redirect('/users/');
  }
});

module.exports = {
  router,
  users,
};
