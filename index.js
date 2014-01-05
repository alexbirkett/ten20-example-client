var optimist = require('optimist');
var requestApi = require('request');
var request = requestApi.defaults({followRedirect: false, jar: requestApi.jar()});

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
   default('f',20).
   default('a',52.80323).
   default('n', -1.6193).
   default('s', 14234234234).
   default('u', 'http://localhost:3000')
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

    var message = {
        timestamp: new Date(),
        latitude: getNextLat(),
        longitude: getNextLng(),
        serial: argv.serial + ''
    };

    console.log('posting message');
    //console.log(message);

    var timeBefore = new Date().getTime();

    request.post({url: argv.url + '/message/' + argv.serial, json: message}, function(err, response, body) {
        if (err) {
            console.log('error ' + err);
        }
        if (response) {
            console.log('status ' + response.statusCode + ' request took ' + (new Date().getTime() - timeBefore));
        }
        setTimeout(postNextLocation, argv.frequency * 1000);
    });


}

postNextLocation();



