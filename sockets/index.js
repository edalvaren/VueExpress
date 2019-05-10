
const {Controller} = require('ethernet-ip');
const socketApi = require('./socketApi');
const {FieldBus} = require('../fieldBus');

io = socketApi.io;




module.exports = function(PLC) {
    io.on('connection', function (socket) {
        FieldBus(PLC);
        console.log(`Socket with ID ${socket.id} connected`);
        socket.on('SEND_MESSAGE', function (data) {
            io.emit('MESSAGE', data);
            console.log(` The message is ${JSON.stringify(data)}\n`);
        });
        socket.on('SEND_TAG', function (data) {
            console.log(`The tag is ${JSON.stringify(data)}\n`)
        });
        socket.on('SEND_TEST', function (data) {
            io.emit('TEST', data);
            console.log(`TEST DATA: ${data}`);
        });
        PLC.scan();
        PLC.forEach(tag => {
            let LatestTagValue;
            LatestTagValue = parseFloat(Math.round(tag.value*100)/100).toFixed(2);
            console.log(`tag value changed to ${tag.value}\n`);
            console.log(`latest tag value changed to ${LatestTagValue}\n`);
        });
    })
};



// PLC.forEach(tag => {
//   tag.on("Changed", (tag) => {
//     latestTagValue = parseFloat(Math.round(tag.value*100)/100).toFixed(2);
//     // io.emit('TAG', latestTagValue);
//     console.log(`tag.value changed to ${tag.value}\n`);
//     console.log(`latestTagValue changed to ${latestTagValue}\n`);
//   });
// });