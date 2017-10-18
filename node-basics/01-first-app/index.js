const http = require('http');

const config = {
    port: process.env.PORT || 3000,
};

const requestHandler = (req, res) => {
    res.writeHead(201, {
        'content-type': 'application/json',
    });
    res.write(JSON.stringify({ message: 'oke?'}));
    res.end();
};

http.createServer(requestHandler)
    .listen(config.port);
