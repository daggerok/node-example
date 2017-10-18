const requestHandler = (req, res) => {
    res.writeHead(201, {
        'content-type': 'application/json',
    });
    res.write(JSON.stringify({ message: 'reusable modules are here!'}));
    res.end();
};

module.exports = requestHandler;
