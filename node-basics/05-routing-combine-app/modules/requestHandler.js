const fs = require('fs');
const url = require('url');

const jsonContentType = { 'content-type': 'application/json', };

const onError = (error, res) => {
    res.writeHead(404, jsonContentType);
    if (error) res.write(JSON.stringify({ error }));
    res.end();
};

const requestHandler = (req, res) => {

    const path = url.parse(req.url).pathname;

    if ('/' === path) {
        fs.readFile(`${__dirname}/../public/index.html`, {}, (error, data) => {
            if (error) {
                onError(error, res);
            } else {
                res.writeHead(200, { 'content-type': 'text/html', });
                res.write(data);
                res.end();
            }
        });
    } else if (path.startsWith('/api')) {
        res.writeHead(200, jsonContentType);
        res.write(JSON.stringify({ message: 'hello' }));
        res.end();
    } else {
        onError(null, res);
    }
};

module.exports = requestHandler;
