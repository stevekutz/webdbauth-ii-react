const server = require('./server');

const port = process.env.PORT || 5002;

server.listen(port, () => {
    console.log(` listening on http://localhost${port}`);
});