var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;

const mongodb = {
    port: process.env.MONGODB_PORT || 27017,
    host: process.env.MONGODB_HOST || '127.0.0.1',
    name: process.env.MONGODB_NAME || 'db',
    collection: 'users',
};
mongodb.url = process.env.MONGODB_URL || `mongodb://${mongodb.host}:${mongodb.port}/${mongodb.name}`;
console.info('application will use next mongodb connection string:', mongodb.url);

const onClose = (db, cb) => {
    db.close(true, () => console.log('connection force closed'));
    if (cb) cb();
};

const mongo = {
    findAll: cb => {
        MongoClient.connect(mongodb.url, (err, db) => {
            const cursor = db.collection(mongodb.collection).find();
            const users = [];
            const iterator = (doc, _err) => {
                users.push(doc);
            };
            cursor.forEach(iterator, () => {
                onClose(db, () => cb(users));
            });
        });
    },
    findOne: (username, cb) => {
        MongoClient.connect(mongodb.url, (_err, db) => {
            const querySelector = { username };
            db.collection(mongodb.collection).findOne(querySelector, (_err, user) => {
                onClose(db, () => cb(user));
            });
        })
    },
    save: (user, cb) => {
        MongoClient.connect(mongodb.url, (_err, db) => {
            db.collection(mongodb.collection).insertOne(user, () => {
                onClose(db, cb);
            });
        });
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
router.get('/', (req, res, next) => {
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
    mongo.findOne(username, user => {
        res.render('users/info', {
            title: 'User info',
            links,
            user,
        });
    });
});

/* POST: create new user. */
router.post('/new/create', (req, res, next) => {
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
