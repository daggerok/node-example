const fs = require('fs');

const requestHandler = (req, res) => {
    fs.readFile(`${__dirname}/../public/index.html`, {}, (error, data) => {
        if (error) {
            console.error('error occurs', error);
            res.writeHead(404, { 'content-type': 'application/json', });
            res.write(JSON.stringify({ error }));
            res.end();
            return;
        }
        res.writeHead(201, { 'content-type': 'text/html', });
        res.write(data);
        res.end();
    });
};

module.exports = requestHandler;
