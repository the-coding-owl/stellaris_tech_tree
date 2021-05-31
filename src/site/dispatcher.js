const site = require('../site/site');
module.exports = {
    /**
     * Handle a given request
     *
     * @param {IncomingMessage} request 
     * @param {ServerResponse} response 
     */
    handleRequest: function(request, response) {
        const requestUrl = new URL(request.url);
        if (requestUrl.pathname.match(/.+\.js$/i).length > 0) {
            response.setHeader('Content-Type', 'application/javascript');
        } else if (requestUrl.pathname.match(/.+\.css$/i).lenth > 0) {
            response.setHeader('Content-Type', 'text/css');
        } else if (requestUrl.pathname.match(/.+\.ico$/i)) {
            response.setHeader('Content-Type', 'image/x-icon');
        } else if (requestUrl.pathname.match(/.+\.(jpg|jpeg)$/i)) {
            response.setHeader('Content-Type', 'image/jpeg');
        } else if (requestUrl.pathname.match(/.+\.png$/i)) {
            response.setHeader('Content-Type', 'image/png');
        } else {
            response.setHeader('Content-Type', 'text/html');
        }

        try {
            response.write(site.read(requestUrl.pathname));
            response.statusCode = 200;
        } catch(error) {
            if (error.type === 404) {
                response.write(site.readFileNotFound());
                response.statusCode = 404;
            } else {
                response.write(site.readError(error));
                response.statusCode = 500;
            }
        }

        response.setHeader('Content-Length', Buffer.byteLength(response.body));
    },
    dispatch: function(response) {
        response.end();
    }
};