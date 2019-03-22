const fs = require('fs');
const path_util = require('path');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const debug = require('./debug.js');

module.exports = {
    write : function (data, writer) {
        var csvWriter = createCsvWriter({
            path: writer.path,
            header: writer.headers,
            append: true,
            fieldDelimiter: writer.delimiter
        });

        //Appending to a CSV doesn't write the header. This creates the header if the file doesn't exist.
        if (!fs.existsSync(writer.path)) {
            const csvStringifier = createCsvStringifier({ header: writer.headers });
            var h = csvStringifier.getHeaderString();
            fs.writeFile(writer.path, h, function (err) {
                if (err)
                    throw err;
            });
        }
        var record = [data];
        csvWriter.writeRecords(record);

        if(writer.debug) debug.write("Wrote to ", writer.path);
    }
}