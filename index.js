var optimist = require('optimist');
var requestApi = require('request');
var request = requestApi.defaults({followRedirect: false, jar: requestApi.jar()});
var async = require('async');

var argv = optimist.usage('Usage: $0  --serial [string] --url [string] --frequency [num]').
    options('s', {
        alias : 'serial',
        describe: 'tracker serial number or id'
    }).
    options('u', {
        alias : 'url',
        describe: 'url'
    }).
    options('f', {
        alias : 'frequency',
        describe: 'update frequency in seconds'
    }).
    options('a', {
        alias : 'latitude',
        describe: 'inital latitude'
    }).
    options('n', {
        alias : 'longitude',
        describe: 'inital longitude'
    }).
   default('f',1).
   default('a',52.80323).
   default('n', -1.6193).
   default('s', 14234234234).
   default('u', 'http://localhost:3000/location/update_by_serial')
   .argv;

// tool functions
function randomBetween(min, max) {
    return (Math.random()*(max - min))+min;
}

function getDelta(delta) {
    var random;
    if (delta === undefined) {
        random = randomBetween(-0.001, 0.001);// (Math.random() - 0.5) * 2 / 1000;
    } else {
        random = delta + randomBetween(-0.0005, 0.0005);
    }
    return random;
}

var lat = argv.latitude;
var lng = argv.longitude;

var latDelta;
var lngDelta;

var getNextLat = function() {
    return lat = lat + getDelta(latDelta);
};

var getNextLng = function() {
    return lng = lng + getDelta(lngDelta);
};

var postNextLocation = function() {

    var location = {
        timestamp: new Date().getTime(),
        latitude: getNextLat(),
        longitude: getNextLng(),
        serial: argv.serial + ''
    };

    console.log('posting location');
    console.log(location);
    request.post({url: argv.url + '/' + argv.serial, json: location}, function(err, response, body) {
        if (err) {
            console.log('error ' + err);
        }
        if (response) {
            console.log('status ' + response.statusCode);
        }

    });

    setTimeout(postNextLocation, argv.frequency * 1000);
}

postNextLocation();



