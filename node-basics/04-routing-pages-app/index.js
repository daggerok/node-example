const http = require('http');
const requestHandler = require('./modules/requestHandler');
const config = require('./modules/config');

http.createServer(requestHandler)
    .listen(config.port);
