# Hubitat Elevation Logging Utility

This is very much a WIP, but I think it's stable enough for usage right now. InfluxDB logging is a WIP, but MySQL, file and CSV exports all work.

What is it?
This is a nodejs application that will subscribe to your events and logs websockets that Hubitat exposes.

Features:
  1. Customizable logging/event trapping in different data sources: File logger, CSV logger, MySQL logger, InfluxDB logger (WIP)
  2. Expandable/configurable to your needs. New logging targets can be created easily in native javascript code. The existing ones can also be modified to your needs.
  2. Allows you to capture events only from devices that you want (subscription model[ish]).
  4. Web based device selector for event subscriptions using the Maker API.
  5. No additional load on your Hubitat hub. All processing is done off-hub to keep your devices and automations working as fast as possible.
  
Installation:
  1. Make sure you have nodejs (duh?).
  2. Download a copy of the code.
  3. In your favorite terminal, go into the directory where you downloaded the code.
  4. run ```npm install```
  5. Open config.json in your favorite editor.
  6. The important sections are:
   
```
   "webserver": {
      "enable": true,
      "port": 80,
      "maker_api_url": "[YOUR MAKER API URL]"
    }
```
You need to make sure that your Maker API URL is populated. In HE, you'll want to make sure that any devices you want logged are selected in Maker API.
Maker API isn't needed right now for basic event logging or log logging, but if you want to have the app manage subscriptions for you, you'll need to enable it.
    
You'll also want to make sure the webserver port doesn't conflict with anything else you have running.
    
```
    "hub": {
    "hub_host": "[YOUR HE IP/DNS NAME]",
```
    
hub_host is the IP or DNS name of your HE hub.
    
```
    "events": {
      "enabled": true,
```
    
You need to enable either events or logs (or both).
    
```
    "subscriptions": [
        41,
        423,
        425,
        418,
        419,
        420
      ],
```

Subscriptions are a list of devices that you want to capture events for. You can just use an empty array (```subscriptions: []```) to capture all devices should you want to. On chatty networks, this **will** generate **large** log files.
      
```
"destinations": [
{
  "type": "file",
  "enabled": true,
  "path": "he-events.log"
},
```

Destinations are where events and logs are written to. Currently, 3 are working (and tested): File logger, CSV logger, and MySQL. The subsections **should** be self-explanitory. Path needs to be a path (and filename) that is accessible by the process running nodejs. Any destinations that you don't want or need can simply be disabled (removing the sections breaks the code for now ;) by setting "enable" : false)

5. Run ```node logging.js```

I would recommend running this with a nodejs manager like PM2, Forever, or Nodemon.

### MySQL Configuration:
I've uploaded scripts for a default events table and logs table. They are located in the mysql-scripts folder.
