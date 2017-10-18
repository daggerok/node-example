const express = require('express');
const app = express();

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


// const user = process.env.RABBITMQ_USER || 'guest';
// const pwd = process.env.RABBITMQ_PASS || 'guest';
const host = process.env.RABBITMQ_HOST || '127.0.0.1';
const port = process.env.RABBITMQ_PORT || '5672';
const url =  process.env.RABBITMQ_URL || `amqp://${host}:${port}`;
const bus = require('servicebus').bus({ url });
const uuid = require('uuid');

const SSE = require('express-sse');
const sse = new SSE(['init']);
app.get('*', (req, res) => {
  sse.init(req, res);
  const payload = { id: uuid.v4(), registered: 'ok' };
  sse.send(payload, 'events.register');
});

// sse.send(content, eventName);
// sse.send(content, eventName, customID);
// sse.updateInit(["array", "containing", "new", "content"]);
// sse.serialize(["array", "to", "be", "sent", "as", "serialized", "events"]);

bus.listen('events.request', payload => {
  sse.send(payload, 'events.response');
});

app.listen(process.env.PORT || '8002');
