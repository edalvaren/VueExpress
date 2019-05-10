const EventEmitter = require('events');
const emitter = new EventEmitter();
const winston = require('./config/winston');

emitter.on('uncaughtException', function (err) {
    winston.warn('Uncaught Exception: ' + err)
});

module.exports = emitter;