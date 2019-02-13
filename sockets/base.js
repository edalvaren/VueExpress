const { Controller, Tag } = require('ethernet-ip');

module.exports = function (io) {
    let compact = new Controller();
    let latestTagValue;
    require('../ethernet')(compact);
    io.on('connection', function (socket) {
        console.log(`Socket with ID ${socket.id} connected`);
        socket.on('SEND_MESSAGE', function(data) {
            io.emit('MESSAGE', data);
            console.log(` The message is ${JSON.stringify(data)}\n`);
        });
        socket.on('SEND_TAG', function(data) {
            io.emit('TAG', data);
            console.log(`The tag is ${JSON.stringify(data)}\n`)
        });
        setInterval(function () {
            socket.emit('STREAM', {'message': "A new title via Socket.IO!"});
        }, 1000);
        compact.forEach(tag => {
            tag.on("Changed", (tag) => {
                latestTagValue = parseFloat(Math.round(tag.value*100)/100).toFixed(2);
                io.emit('TAG', latestTagValue);
                console.log(`tag.value changed to ${tag.value}\n`);
                console.log(`latestTagValue changed to ${latestTagValue}\n`);
            });
        });
    });
};


