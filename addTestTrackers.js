var optimist = require('optimist');
var argv = optimist.usage('Usage: $0  --email [string] --password [string] --url [string]').
    options('e', {
        alias : 'email',
        describe: 'email address'
    }).
    options('p', {
        alias : 'password',
        describe: 'https listening port'
    }).
    options('u', {
        alias : 'url',
        describe: 'url'
    }).
    default('e', 'test@ten20.com').
    default('p','test').
    default('u', 'http://localhost:3000').argv;


var requestApi = require('request');
var request = requestApi.defaults({followRedirect: false, jar: requestApi.jar()});
var async = require('async');

var trackers = [
    {
        "serial": "14234234234", // device serial number
        "name": "Xiaolei",
        "protocol": "phonelocator",
        "settings":{
            "iconEmail": "email.address.with.account@gravitar.com",
            "iconColor": "FF00FF",
            "updateFrequency": 60 * 60 * 1000
        }
    },
    {
        "serial": "24234234235", // device serial number
        "name": "Alex",
        "protocol": "TR-203",
        "settings":{
            "iconEmail": "email.address.with.account@gravitar.com",
            "iconColor": "FFFF00",
            "updateFrequency": 60 * 1000
        }
    }
];

var url = argv.url;

async.waterfall([

    function (callback) {

        var credential = {
            email: argv.email,
            password: argv.password
        };

        request.post({url: url + '/signin', json: credential}, callback);
    },
    function (response, body, callback) {
        console.log('signin response ' + response.statusCode);
        if (response.statusCode === 200) {
            request.del({url: url + '/trackers', json: true }, callback);
        } else {
            callback('could not delete trackers');
        }
    },
    function (response, body, callback) {
        console.log('signin response ' + response.statusCode);
        if (response.statusCode === 200) {
            request.put({url: url + '/trackers', json: trackers }, callback);
        } else {
            callback('invalid username and password');
        }
    },
    function(response, body) {
        console.log('put trackers response ' + response.statusCode);
    }
],
    function (err) {
        if (err) {
            console.log(err);
        }
    });



