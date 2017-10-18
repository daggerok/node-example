var express = require('express');
var router = express.Router();

const mongodb = {
    host: process.env.MONGODB_HOST || '127.0.0.1',
    port: process.env.MONGODB_PORT || 27017,
    name: process.env.MONGODB_NAME || 'db',
    collection: 'users',
};
mongodb.url = process.env.MONGODB_URL || `${mongodb.host}:${mongodb.port}/${mongodb.name}`;
console.info('application will use next mongodb connection string:', mongodb.url);

const monk = require('monk');
const db = monk(mongodb.url);
const users = db.get(mongodb.collection);
const close = db => db.close();

const mongo = {
    findAll: cb => {
        const querySelector = {};
        users.find(querySelector, { sort: { username: -1 } })
             .then(cb);
    },
    findOne: (username, cb) => {
        const querySelector = { username };
        users.findOne(querySelector)
             .then(cb)
    },
    save: (user, cb) => {
        users.insert(user)
             .then(cb);
    },
};

const links = require('./index').links;

const validate = {
    user: req => {
        req.check('username', 'Username is empty').notEmpty();
        req.check('username', 'Username is too short').isLength({ min: 3, });
        req.check('email', 'Email is empty').notEmpty();
        req.check('email', 'Email is invalid').isEmail();
    },
};

/* GET: users listing. */
router.get('/', (req, res, _next) => {
    mongo.findAll(users => {
        res.render('users/list', {
            title: 'List of users',
            links,
            users,
            success: req.session.success,
            errors: req.session.errors,
        });
    });
});

/* GET: create new user. */
router.get('/new', (req, res, _next) => {
    res.render('users/new', {
        title: 'Create new user',
        links,
        success: req.session.success,
        errors: req.session.errors,
    });
    req.session.errors = null;
});

/* GET: user info. */
router.get('/:username', (req, res, _next) => {
    const username = req.params.username;
    mongo.findOne(username, user => {
        res.render('users/info', {
            title: 'User info',
            links,
            user,
        });
    });
});

/* POST: create new user. */
router.post('/new/create', (req, res, _next) => {
    validate.user(req);
    const errors = req.validationErrors();
    req.session.success = !!errors;
    if (!!errors) {
        req.session.errors = errors;
        res.redirect('/users/new/');
    } else {
        const username = req.body.username;
        const email = req.body.email;
        const user = { username, email, };
        mongo.save(user, () => {
            res.redirect(`/users/${username}`);
        });
    }
});

module.exports = {
    router,
};
