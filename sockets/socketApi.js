
/** Socket IO API for real time communication **/

const socket_io = require('socket.io');
const io = socket_io();
const socketApi = {};
const FieldBus = require('../fieldBus');
const {parseTag} = require('../fieldBus/utilities');
const {TagObjArray} = require('../fieldBus/TagNames');
const PlcTag = require('../models/plcTag');
const {WriteToDint, WriteBoolFalse, WriteBoolTrue} = require('../fieldBus/plcWritingToTags');
const winston = require('../config/winston');
const { findAlarm, readAlarm, alarmTagName } = require('../fieldBus/alarms');
socketApi.io = io;

const {Controller} = require('ethernet-ip');

const shallowCopy = TagObjArray.slice();
io.on('connection', function (socket) {
    winston.info(`Socket with ID ${socket.id} connected`);
    const PLC = new Controller();
    FieldBus(PLC);


    socketApi.sendTagValue = function(tags) {
        io.sockets.emit('TAG', tags)
    };

    socketApi.sendAlarm = function(msg) {
       io.sockets.emit('ALARM', msg);
       winston.warn(msg);
    };


    socketApi.writeTagValue = function(tag) {
      io.sockets.emit('WRITE_TAG', tag)
    };


    const updateTagArray = setInterval(function () {
        // console.log(shallowCopy);
        socketApi.sendTagValue(shallowCopy);

    }, 2000);
    PLC.forEach(tag => {
        tag.on("Initialized", (tag) => {
           let newTag = shallowCopy.find(o => o.name === tag.name);
           let index = shallowCopy.indexOf(newTag);
            if (index !== -1) {
                shallowCopy[index] = new PlcTag(tag.name, null, parseTag(tag.value));
            }
        });
        tag.on("Changed", (tag, oldValue) => {
            if(!(tag.value === "Nan")){
                // winston.info("Skipping null tag");
            } else {
                let newTag = shallowCopy.find(o => o.name === tag.name);
                // console.log(newTag);
                let index = shallowCopy.indexOf(newTag);
                if (index !== -1) {
                    shallowCopy[index] = new PlcTag(tag.name, null, tag.value);
                }
                socketApi.sendTagValue(parseTag(tag));
            }
            if (tag.name === alarmTagName) {
                let activeAlarm = findAlarm(tag.value);
                socketApi.sendAlarm(activeAlarm)
            }
        });
        // updateTags(tag);
    });


    socket.on('READ_ALARMS', function () {
        winston.info('Reading Alarms');
        socketApi.sendAlarm(readAlarm(PLC, alarmTagName, findAlarm));
    });


    socket.on('TOGGLE_START', function (){
        winston.info("The Start button was pressed! ");
        WriteBoolTrue(PLC, "HMI.Start");
        setTimeout(WriteBoolFalse, 3000, PLC, "HMI.Start" );
    });
    socket.on('TOGGLE_STOP', function (){
        WriteBoolTrue(PLC, "HMI.Stop")
            .catch(function (error) {
                winston.warn(`couldn't write to the stop tag because there was an ${error.message}`)
            });
        setTimeout(WriteBoolFalse, 3000, PLC, "HMI.Stop" );
    });
    socket.on('TOGGLE_BIT', function (data){
        winston.info(`The ${data} button was pressed..hurray! `);
        WriteBoolTrue(PLC, "HMI.Fault_Reset_Main");
        setTimeout(WriteBoolFalse, 2000, PLC, "HMI.Fault_Reset_Main" );
    });
    socket.on('SEND_MESSAGE', function (data) {
        winston.info(` The message is ${JSON.stringify(data)}\n`);
        if(!data){
            winston.warn("You must specify tag name");
        } else {
            let newTag = TagObjArray.find(o => o.name === data);
            winston.info(newTag);
            WriteToDint(PLC, data, 20);
        }
    });


    socket.on('error', (error) => {
       winston.error("There was an error. The error says: " + error.message)
    });

    socket.on('disconnecting', (reason) => {
        winston.warn(`The socket disconnected due to reasons: ${reason}`);
        clearInterval(updateTagArray);
    });
});




module.exports = socketApi;