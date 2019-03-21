const fs = require('fs');
const path_util = require('path');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
    write : function (data, dest) {
        var csvWriter = createCsvWriter({
            path: dest.path,
            header: dest.headers,
            append: true,
            fieldDelimiter: dest.delimiter
        });

        //Appending to a CSV doesn't write the header. This creates the header if the file doesn't exist.
        if (!fs.existsSync(dest.path)) {
            const csvStringifier = createCsvStringifier({ header: dest.headers });
            var h = csvStringifier.getHeaderString();
            fs.writeFile(dest.path, h, function (err) {
                if (err)
                    throw err;
            });
        }
        var record = [data];
        csvWriter.writeRecords(record);
    }
}