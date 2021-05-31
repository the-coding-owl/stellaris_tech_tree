const http = require('http');
const dispatcher = require('../site/dispatcher');
const site = require('../site/site');
const server = http.createServer((request, response) => {
    dispatcher.handleRequest(request, response);
    dispatcher.dispatch(response);
});
server.listen({port: 3000, host: 'localhost'}, () => {
    console.log(`Server running at localhost:3000`);
});