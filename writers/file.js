const fs = require('fs');
const path_util = require('path');
const debug = require('./debug.js');

module.exports = {
    write: function (data, dest) {
        fs.appendFile(dest.path, JSON.stringify(data), function (err) {
            if (err)
                throw err;
        });
        if(dest.debug) debug.write("Wrote to ", dest.path);
    }
}
