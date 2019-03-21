const Influx = require('influx');

module.exports = {
    write : function(data, dest) {
        const influx = new Influx.InfluxDB({
            host: dest.host,
            port: dest.port,
            username: dest.user,
            password: dest.pass,
            database: dest.database,
            schema: dest.schema
        });


        influx.writePoints(
            [{
              measurement: 'response_times',
              tags: { host: os.hostname() },
              fields: { duration, path: req.path },
            }]
        );
    }


}