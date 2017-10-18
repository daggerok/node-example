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
  });
});

/* GET: create new user. */
router.get('/new', (req, res, next) => {
  res.render('users/new', {
    title: 'Create new user',
    links,
  });
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
  const username = req.body.username;
  const email = req.body.email;
  if (username && email) users[username] = { username, email };
  res.redirect('/users/');
});

module.exports = {
  router,
  users,
};
