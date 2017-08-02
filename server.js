const http = require('http');
const app = require('./lib/app');
require('./lib/connect');

const server = http.createServer(app);

const port = 3000;

server.listen(port, () => {
    console.log('server is up and running on port', server.address().port);
});