
/** Socket IO API for real time communication **/

const socket_io = require('socket.io');
const io = socket_io();
const socketApi = {};
const FieldBus = require('../fieldBus');
const {logTags, updateTags, parseTag} = require('../fieldBus/utilities');


socketApi.io = io;

const {Controller} = require('ethernet-ip');

io.on('connection', function (socket) {
    console.log(`Socket with ID ${socket.id} connected`);
    const PLC = new Controller();
    FieldBus(PLC);

    socketApi.sendTagValue = function(tag) {
        io.sockets.emit('TAG', tag.value.toString())
    };

    PLC.forEach(tag => {
        tag.on("Changed", (tag, oldValue) => {
            if(!tag.value){

            } else {
                io.emit('TAG', tag.value.toString());
                socketApi.sendTagValue(parseTag(tag));
            }
        });
        // updateTags(tag);
    });


    socket.on('SEND_MESSAGE', function (data) {
        io.emit('MESSAGE', data);
        console.log(` The message is ${JSON.stringify(data)}\n`);
    });


    socketApi.sendNotification = function() {
        io.sockets.emit('hello', {msg: 'Hello World!'});
    };

});



module.exports = socketApi;