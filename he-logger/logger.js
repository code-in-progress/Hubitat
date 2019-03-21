const WebSocket = require('ws');
const fs = require('fs');

const he_host = '192.168.1.110';
const he_event_socket = 'eventsocket';
const he_log_socket = 'logsocket';

const log_destinations = ['file','console','mysql'];


const events_ws = new WebSocket('ws://' + he_host + '/' + he_event_socket);
const logs_ws = new WebSocket('ws://' + he_host + '/' + he_log_socket);


ws.on('message', function incoming(data) {
    var outData = {
	    timestamp: new Date().toString(),
	    evt: JSON.parse(data)
    };

    fs.appendFile('he-logs.json', outData, function (err) {
        if (err) throw err;
        console.log('Saved!');
    }); 
    console.log(outData);
});

function isLogDestination(dest) {
    return log_destinations.find(function(e) {
        if(e == dest)
            return true;
    });
}