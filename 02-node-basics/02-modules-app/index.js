const http = require('http');
const requestHandler = require('./reusable-modules/requestHandler');
const config = require('./reusable-modules/config');

http.createServer(requestHandler)
    .listen(config.port);
