const Influx = require('influx');
const sprintf = require('sprintf-js').sprintf;
const debug = require('./debug.js');

const ACTIVE = 'active';
const CLOSED = 'closed';
const DETECTED = 'detected';
const FOLLOW_SCHEDULE = 'follow schedule';
const GOOD = 'good';
const HEATING = 'heating';
const LOCKED = 'locked';
const MUTED = 'muted';
const OFF = 'off';
const ON = 'on';
const OPEN = 'open';
const PRESENT = 'present';
const PUSHED = 'pushed';
const SLEEPING = 'sleeping';
const TOUCHED = 'touched';
const WET = 'wet';


module.exports = {
    write : function(data, writer) {
        var n = data.name;
        var attrs = writer.attributes;
        var exists = attrs.indexOf(n) !== -1;

        if(writer.debug) debug.writeJS("Found attribute match for " + n, attrs.indexOf(n) !== -1);
        
        if(exists) {
            const influx = new Influx.InfluxDB({
                host: writer.host,
                port: writer.port,
                username: writer.user ? writer.user : null,
                password: writer.pass ? writer.pass : null,
                database: writer.database,
            });

            var prc = getValue(data);

            var idata = [{
                tags: { 
                    hub: "'" + data.hubId ? data.hubId : 'HE1' + "'",
                    deviceId: data.deviceId, 
                    displayName: "'" + data.displayName + "'",
                    'unit': "'" + data.unit + "'"
                },
                fields: { 
                    // 'deviceId': data.deviceId, 
                    // 'displayName': "'" + data.displayName + "'",
                    // 'unit': "'" + data.unit + "'",
                    'value': prc.value,
                    //'valueBinary': prc.isBinary ? prc.value : null
                },
            }];

            if(writer.debug) debug.writeJS("Data being sent to influxdb",idata);
            
            influx.writeMeasurement(data.name, idata);
            
            if(writer.debug) debug.write("Wrote to InfluxDB");
        }
    }
}

function getValue(data) {
    var v = {
        'value' : null,
        'isBinary' : null
    };

    if(data.name == "acceleration") {
        v.value = (data.value == ACTIVE ? 1 : 0);
        v.isBinary = true;
    }
        
    else if(data.name == "alarm") {
        v.value = (data.value != OFF ? 1 : 0);
        v.isBinary = true;
    }
            
    else if(data.name == "button") {
        v.value = (data.value != PUSHED ? 1 : 0);
        v.isBinary = true;
    }

    else if(data.name == "carbonMonoxide") {
        v.value = (data.value == DETECTED ? 1 : 0);
        v.isBinary = true;
    }
        
    else if(data.name == "consumableStatus") {
        v.value = (data.value == GOOD ? 1 : 0);
        v.isBinary = true;
    }
        
    else if(data.name == "contact") {
        v.value = (data.value == OPEN ? 1 : 0);
        v.isBinary = true;
    }
    
    else if(data.name == "door") {
        v.value = (data.value != OPEN ? 1 : 0);
        v.isBinary = true;
    }
    
    else if(data.name == "lock") {
        v.value = (data.value == LOCKED ? 1 : 0);
        v.isBinary = true;
    }
    
    else if(data.name == "motion") {
        v.value = (data.value == ACTIVE ? 1 : 0);
        v.isBinary = true;
    }
    
    else if(data.name == "mute") {
        v.value = (data.value == MUTED ? 1 : 0);
        v.isBinary = true;
    }
    
    else if(data.name == "presence") {
        v.value = (data.value == PRESENT ? 1 : 0);
        v.isBinary = true;
    }
    
    else if(data.name == "shock") {
        v.value = (data.value == DETECTED ? 1 : 0);
        v.isBinary = true;
    }
    
    else if(data.name == "sleeping") {
        v.value = (data.value == SLEEPING ? 1 : 0);
        v.isBinary = true;
    }
    
    else if(data.name == "smoke") {
        v.value = (data.value == DETECTED ? 1 : 0);
        v.isBinary = true;
    }
    
    else if(data.name == "sound") {
        v.value = (data.value == DETECTED ? 1 : 0);
        v.isBinary = true;
    }
    
    else if(data.name == "switch") {
        v.value = (data.value == ON ? 1 : 0);
        v.isBinary = true;
    }
    
    else if(data.name == "tamper") {
        v.value = (data.value == DETECTED ? 1 : 0);
        v.isBinary = true;
    }
    
    else if(data.name == "thermostatMode") {
        v.value = (data.value != OFF ? 1 : 0);
        v.isBinary = true;
    }
    
    else if(data.name == "thermostatFanMode") {
        v.value = (data.value != OFF ? 1 : 0);
        v.isBinary = true;
    }
    
    else if(data.name == "thermostatOperatingState") {
        v.value = (data.value == HEATING ? 1 : 0);
        v.isBinary = true;
    }
    
    else if(data.name == "thermostatSetpointMode") {
        v.value = (data.value != FOLLOW_SCHEDULE ? 1 : 0);
        v.isBinary = true;
    }
    
    else if(data.name == "touch") {
        v.value = (data.value != TOUCHED ? 1 : 0);
        v.isBinary = true;
    }
    
    else if(data.name == "optimisation") {
        v.value = (data.value == ACTIVE ? 1 : 0);
        v.isBinary = true;
    }
    
    else if(data.name == "windowFunction") {
        v.value = (data.value == ACTIVE ? 1 : 0);
        v.isBinary = true;
    }
    
    else if(data.name == "water") {
        v.value = (data.value == WET ? 1 : 0);
        v.isBinary = true;
    }
    
    else if(data.name == "windowShade") {
        v.value = (data.value == CLOSED ? 1 : 0);
        v.isBinary = true;
    }
        
    else if(data.name == "threeAxis") {
        var v = data.value.split(',');
        var x = v[0];
        var y = v[1];
        var z = v[2];
        v.value = {
            x: v[0],
            y: v[1],
            z: y[2]
        };
        v.isBinary = false;
    }
    else if (data.value ==~ /.*[^0-9\.,-].*/) { // match if any characters are not digits, period, comma, or hyphen.
		v.value = '"' + value + '"';
        v.isBinary = false;
    }
    
    // Catch any other general numerical event (carbonDioxide, power, energy, humidity, level, temperature, ultravioletIndex, voltage, etc).
    else {
        v.value = data.value;
        v.isBinary = false;
    }

    return v;
}