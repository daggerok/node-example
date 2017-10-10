var express = require('express');
var router = express.Router();

const links = [
    {
        href: '/',
        label: 'home page',
    },
    {
        href: '/users/',
        label: 'users page',
    },
    {
        href: '/users/new',
        label: 'create new user page',
    },
];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express',
    links,
  });
});

module.exports = {
  router,
  links,
};
