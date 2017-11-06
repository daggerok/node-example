const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || '3000';
const jwtKey = process.env.JWT_KEY || 'secret';

const UNAUTHORIZED = 401;

app.post('/login', (req, res, next) => {
  const username = req.header('username');
  const password = req.header('password');

  if (!username || !password) {
    res.sendStatus(UNAUTHORIZED);
    return;
  }

  const user = { username, password };
  const token = jwt.sign({ user }, jwtKey);
  const publicUser = Object.assign({}, user, {
    password: user.password.replace(/(.*)/gi, '*')
  });

  res.json({
    access_token: token,
    publicUser,
  });
});

const ensureToken = (req, res, next) => {
  const bearerHeader = req.header('Authorization');

  if (!bearerHeader) {
    res.sendStatus(UNAUTHORIZED);
    return;
  }

  const bearer = bearerHeader.split(' ');
  const token = bearer[1];

  req['access_token'] = token;
  next();
};

app.post('/', ensureToken, (req, res, next) => {
  const token = req['access_token'];

  jwt.verify(token, 'secret', (err, data) => {

    if (err) {
      res.sendStatus(UNAUTHORIZED);
      return;
    }

    res.json({
      message: 'secured REST API',
      // for: debug only
      data,
    });
  });
});

app.get('/', (req, res, next) => {
  res.json({
    message: 'not secured REST API',
  });
});

app.get('*', (req, res, next) => {
  res.json({
    api: [
      { GET: '/' },
      { POST: '/' },
      { POST: '/login' },
    ],
  });
});

app.listen(port, _ => console.log(`listen ${port} port`));
