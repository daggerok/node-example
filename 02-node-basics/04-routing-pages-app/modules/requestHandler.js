const fs = require('fs');
const url = require('url');

const pathTo = page => `${__dirname}/../pages/${page}.html`;

const onPage = (page, res) => {
    fs.readFile(page, {}, (error, data) => {
        if (error) {
            onError(error, res);
        } else {
            res.writeHead(200, { 'content-type': 'text/html', });
            res.write(data);
            res.end();
        }
    });
};

const onError = (error, res) => {
    res.writeHead(404, { 'content-type': 'application/json', });
    if (error) res.write(JSON.stringify({ error }));
    res.end();
};

const requestHandler = (req, res) => {

    const path = url.parse(req.url).pathname;

    switch (path) {

        case '/':
            onPage(pathTo('index'), res);
            break;

        case '/login':
            onPage(pathTo('login'), res);
            break;

        default:
            onError('Page was not found', res);
    }
};

module.exports = requestHandler;
