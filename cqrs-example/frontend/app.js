const express = require('express');
const app = express();

const path = require('path');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

const logger = require('morgan');
app.use(logger('dev'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header("Access-Control-Max-Age", "3600");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

const router = express.Router();

// const user = process.env.RABBITMQ_USER || 'guest';
// const pwd = process.env.RABBITMQ_PASS || 'guest';
const host = process.env.RABBITMQ_HOST || '127.0.0.1';
const port = process.env.RABBITMQ_PORT || '5672';
const url =  process.env.RABBITMQ_URL || `amqp://${host}:${port}`;
const bus = require('servicebus').bus({ url });
const uuid = require('uuid');

app.use('/cmd', router.post('/', (req, res) => {
  const body = req.body;
  console.log('sending...', body);
  bus.send('events.request', { body });
  res.status(201);
  res.json({ message: 'ok' });
}));

app.use('*', (req, res) => res.render('index'));

app.use(router);

// fallback
app.use('*', (req, res) => res.redirect('/'));

module.exports = app;
