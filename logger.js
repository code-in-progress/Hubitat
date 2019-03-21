const WebSocket = require('ws');
const fs = require('fs');
const path_util = require('path');
const sprintf = require('sprintf-js').sprintf;
const assert = require('assert');

var config = require('./config.json');

if(config_checks()) {
    global.config = config;
    global.debug = config.app.debug;
    var subscriptions = config.hub.events.subscriptions;
}
else {
    process.exit(1);
}

var hub = config.hub;
var events = hub.events;
var logs = hub.logs;


var webserver = config.app.webserver;
if(webserver.enable) {
    const express = require('express');
    const server = express();
    const bodyParser = require('body-parser')
    
    server.use(bodyParser.urlencoded({ extended: false }))

    server.post('/select_devices', function(req, res) {
        console.log(req.body);
        var html = '<html><title>Selected Devices</title><body><div>You selected the following devices:</div>';
        
        fs.writeFile("config.json.bak", JSON.stringify(config, null, 2), function (err) {
            if (err)
                throw err;
        });
        
        subscriptions = [];

        for(var device in req.body) {
            subscriptions.push(parseInt(req.body[device]));
            html += '<div>' + device + '</div>';
        }
        
        delete require.cache[require.resolve('./config.json')];

        fs.writeFile("config.json", JSON.stringify(config, null, 2), function (err) { });
        html += '<div><br/><br/>Your configuration has been saved and your previous configuration has been saved to config.json.bak.</body></html>';
        
        res.send(html);
    });

    server.get('/get_devices', function (req, res) {
        const request = require('request');

        request(webserver.maker_api_url, { json: true }, (err, resp, body) => {
            if (err) { return console.log(err); }
            var html = '<html><title>Select Devices</title><style type="text/css">font-family:verdana; font-size: 10pt;</style><body><h4>Please select your devices below:</h4><br/><form method="POST" action="select_devices">';

            for(var d in body) {
                var device = body[d];
                
                var index = subscriptions.indexOf(parseInt(device.id));

                html += "<input type=\"checkbox\" id=\"" + device.label + "\" name=\"" + device.label + "\" value=\"" + device.id + "\"" + (index !== -1 ? " checked " : "") + ">" + device.label + "<br/>";
                
            }
            html += '<input type="submit" /></form></body></html>';
            res.send(html);
        });
    });
    
    server.listen(webserver.port);
    console.log('Listening on port ' + webserver.port);
}

//Setup the listener for the events websocket.
if(events.enabled) {
    var con = sprintf('ws://%s/%s', hub.hub_host, events.socket_name);
    var ws = getSocket(con);
    
    ws.on('open', function(err) {
        if (err) throw err;
        if(global.debug) console.log("Waiting on events");
    });
    
    ws.on('message', function incoming(data) {
        var out_data = getEventData(JSON.parse(data));
        var dests = events.destinations;
        
        if(subscriptions !== null && Array.isArray(subscriptions) && subscriptions.length > 0) {
            inSubs = subscriptions.indexOf(out_data.deviceId) !== -1;
        }
        else { inSubs = true; }
        
        if(inSubs) {
            dests.forEach(function(dest) {
                if(dest.enabled) {
                    switch(dest.type) {
                        case "file" :
                            var file_writer = require('./writers/file');
                            file_writer.write(out_data, dest);
                            break;
                        case "csv" :
                            var csv_writer = require('./writers/csv');
                            csv_writer.write(out_data, dest);
                            break;
                        case "mysql": 
                            var mysql_writer = require('./writers/mysql');
                            mysql_writer.write(out_data, dest);
                            break;
                        case "influxdb": 
                            var influxdb_writer = require('./writers/influxdb');
                            influxdb_writer.write(out_data, dest);
                            break;
                        case "console" : 
                            var console_writer = require('./writers/console');
                            console_writer.write(out_data, dest);
                            break;
                    }
                }
            });
        }
    });
}

if(logs.enabled) {
    var con = sprintf('ws://%s/%s', hub.hub_host, logs.socket_name);
    var ws = getSocket(con);
    
    ws.on('message', function incoming(data) {
        var out_data = getLogData(JSON.parse(data));
        var dests = logs.destinations;    
        dests.forEach(function(dest) {
            if(dest.enabled) {
                switch(dest.type) {
                    case "file" :
                        var logs_file_writer = require('./writers/file');
                        logs_file_writer.write(out_data, dest);
                        break;
                    case "csv" :
                        var logs_csv_writer = require('./writers/csv');
                        logs_csv_writer.write(out_data, dest);
                        break;
                    case "mysql": 
                        var logs_mysql_writer = require('./writers/mysql');
                        logs_mysql_writer.write(out_data, dest);
                        break;
                    case "influxdb": 
                        var logs_influxdb_writer = require('./writers/influxdb');
                        logs_influxdb_writer.write(out_data, dest);
                        break;
                    case "console" : 
                        var logs_console_writer = require('./writers/console');
                        logs_console_writer.write(out_data, dest);
                        break;
                }
            }
        });
    });
}

function getSocket(connection) {
    return new WebSocket(connection);
}

function getEventData(data) {
    var ts = Date.now();
    var hsts = new Date().toString();
    
    var return_data = {
        source: data.source,
        name: data.name,
        displayName: data.displayName,
        value: data.value,
        unit: data.unit,
        deviceId: data.deviceId,
        hubId: data.hubId,
        locationId: data.locationId,
        installedAppId: data.installedAppId,
        descriptionText: data.descriptionText,
        timestamp: ts,
        date: hsts
    };

    return return_data;
}

function getLogData(data) {
    var return_data = {
        name: data.name,
        msg: data.msg,
        id: data.id,
        time: data.time,
        type: data.type,
        level: data.level
    };

    return return_data;
}

// process.on('uncaughtException', (err) => {
//     console.error('There was an uncaught error', err);
//     process.exit(1);
// });

function config_checks() {
    var host = config.hub;
    var msg = [];
    console.log("Checking configuration");

    if(!host.events.enabled && !host.logs.enabled) {
        msg.push("Events or Logs must be enabled (host: { events: { enabled: true|false } } { logs: { enabled: true|false } })");
    }

    if(host.events.enabled) {
        if(host.events.socket_name === undefined || host.events.socket_name == '') {
            msg.push("Socket name is required for events. Please set the socket name to 'eventsocket' (or whatever the current name is).");
        }
        
        if(host.events.destinations === undefined || host.events.destinations.length == 0) {
            msg.push("No event destinations have been defined.");
        }
    }

    if(host.logs.enabled) {
        if(host.logs.socket_name === undefined || host.logs.socket_name == '') {
            msg.push("Socket name is required for logs. Please set the socket name to 'logsocket' (or whatever the current name is).");
        }
        
        if(host.logs.destinations === undefined || host.logs.destinations.length == 0) {
            msg.push("No log destinations have been defined.");
        }
    }

    if(msg.length > 0) {
        msg.forEach(function(m) {
            console.log(m);
        });
        return false;
    }
    else { console.log("Configuration check passed"); return true; }
}

function output(msg) {
    if(global.debug)
        console.log(JSON.stringify(msg));
}