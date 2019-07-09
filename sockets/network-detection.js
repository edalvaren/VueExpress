const networkDetector = {};
const winston = require('../config/winston');

var EventEmitter = require('events').EventEmitter,
    rl = require('readline');
const {spawn, exec} = require('child_process');

var RE_SUCCESS = /bytes from/i;
var INTERVAL = 2;
//var IP = process.env.MACHINE_IP_ADDRESS;
var IP = "172.16.30.55"
console.log(IP);

var proc = exec("ping 172.16.30.55");
// var proc = spawn('ping 172.16.30.55');
var rli = rl.createInterface(proc.stdout, proc.stdin);
var network = new EventEmitter();

network.online = false;
rli.on('line', function (str) {
    if (RE_SUCCESS.test(str)) {
        if (!network.online) {
            network.online = true;
            network.emit('online');
            winston.info('Online event emitted')
        }
    } else if (network.online) {
        network.online = false;
        network.emit('offline');
        winston.info('Offline event emitted')
    }
});


// listen for the `online` and `offline` events ...
network.on('online', function() {
    console.log('online!');
}).on('offline', function() {
    console.log('offline!');
});

networkDetector.network = network;


