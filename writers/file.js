const fs = require('fs');
const path_util = require('path');

module.exports = {
    write: function (data, dest) {
        fs.appendFile(dest.path, JSON.stringify(data), function (err) {
            if (err)
                throw err;
        });
    }
}
