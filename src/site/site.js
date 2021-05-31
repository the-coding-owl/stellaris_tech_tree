const fs = require('fs');
module.exports = {
    /**
     * Read a file from the filesystem
     *
     * @param {String} file 
     */
    read: function(file) {
        try {
            fs.readFileSync('src/site/public/' + file, {encoding: 'utf-8', flag: 'r'});
        } catch(error) {
            throw { type: 404, message: 'File not found!' };
        }

        return 
    },
    /**
     * Read the error page
     */
    readError: function() {
        return this.read('src/site/public/error.html');
    },
    /**
     * Read the file-not-found page
     */
    readFileNotFound: function() {
        return this.read('src/site/public/notfound.html');
    }
};