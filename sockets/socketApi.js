
/** Socket IO API for real time communication **/

const socket_io = require('socket.io');
const io = socket_io();
const socketApi = {};
const {fieldBus, readAllTagsOnce, groupTags} = require('../fieldBus');
const {parseTag} = require('../fieldBus/utilities');
const {TagObjArray, AllTags_Names} = require('../fieldBus/TagNames');
const PlcTag = require('../models/plcTag');
const {WriteToReal, WriteToDint, WriteBoolFalse, WriteBoolTrue, ToggleBit} = require('../fieldBus/plcWritingToTags');
const winston = require('../config/winston');
const { findAlarm, readAlarm, alarmTagName, resetAlarmTagName} = require('../fieldBus/alarms');
socketApi.io = io;

const {Controller, TagGroup} = require('ethernet-ip');

var copyonce = true;

while (copyonce){
    var shallowCopy = TagObjArray.slice();
    copyonce = false;
}


var activeAlarms = [];


io.on('connection', function (socket) {
    winston.info(`Socket with ID ${socket.id} connected`);
    const PLC = new Controller();
    const tagGroup = new TagGroup();

    fieldBus(PLC);






    socketApi.sendTagValue = function(tags) {
        io.sockets.emit('TAG', tags);
        winston.info(`the value being sent is ${tags[19].value.toString()}`)
    };

    socketApi.sendAlarm = function(msg) {
       io.sockets.emit('ALARM', msg);

        winston.warn(msg);
    };


    socketApi.writeTagValue = function(tag) {
      io.sockets.emit('WRITE_TAG', tag)
    };


    const updateTagArray = setInterval(function () {
        socketApi.sendTagValue(shallowCopy);
    }, 1000);





    /**
     * Reading all tags to which we subscribed. This read uses the scan() method.
     */
    PLC.forEach(tag => {
        tag.on("Initialized", (tag) => {
           let newTag = shallowCopy.find(o => o.name === tag.name);
           let index = shallowCopy.indexOf(newTag);
            if (index !== -1) {
                shallowCopy[index] = new PlcTag(tag.name, null, parseTag(tag.value));
            }
        });
        tag.on("Changed", (tag, oldValue) => {
            // if(!(tag.value === "Nan")){
            // } else {
                let newTag = shallowCopy.find(o => o.name === tag.name);

                // winston.info(newTag);
                let index = shallowCopy.indexOf(newTag);
                if (index !== -1) {
                    let addedTag = new PlcTag(tag.name, null, parseTag(tag.value));
                    // winston.info(` The tag is ${addedTag.name} with a value of ${addedTag.value}\n`)
                    shallowCopy.splice(index, 1, addedTag);
                    winston.info(`The shallow copy array at position ${index} is now ${shallowCopy[index].value}`)
                    // shallowCopy.splice(index, 0, addedTag);
                }

                // socketApi.sendTagValue(parseTag(tag));

            // if (tag.name === alarmTagName) {
            //     // if the alarm is not already active
            //     if (activeAlarms.indexOf(tag.value) === -1){
            //         // add the alarm to the array of active alarms (Contains only the alarm number)
            //         activeAlarms.push(tag.value);
            //
            //         winston.info(`The array is now ${activeAlarms}`);
            //         // findAlarm(tag.value, socketApi.sendAlarm);
            //         let activeAlarm = findAlarm(tag.value);
            //         socketApi.sendAlarm(activeAlarm);
            //         winston.info(`sending Alarm via socket.. alarm is ${activeAlarm.AlarmName}`);
            //     }
            //
            // }
        });
        // updateTags(tag);
    });


    socket.on('READ_ALARMS', function () {
        winston.info('Reading Alarms');
        var readAl = readAlarm(PLC, alarmTagName);
        readAl.then(function(result){
            if (activeAlarms.indexOf(result) === -1){
                activeAlarms.push(result);
                let myAlarm = findAlarm(result);
                socketApi.sendAlarm(myAlarm);
            }
        })
    });
    socket.on('CLEAR_ALARMS', function () {
        winston.info(`Cleared all active alarms... the array is now ${activeAlarms}`)
        ToggleBit(resetAlarmTagName, PLC);
        while (activeAlarms.length > 0) {
            activeAlarms.pop();
        }
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
    socket.on('TOGGLE_BIT', function (tagName){
        winston.info(`The ${data} button was pressed..hurray! `);
        WriteBoolTrue(PLC, "HMI.Fault_Reset_Main");
        setTimeout(WriteBoolFalse, 2000, PLC, "HMI.Fault_Reset_Main" );
    });
    socket.on('CHANGE_SPEED', function (value) {
        try {
            WriteToDint(PLC, "HMI_Frequency_Setting", value);
        } catch (error) {
            winston.error(error.message);
        }
    });

    socket.on('CHANGE_TORQUE', function (value) {
        try {
            WriteToReal(PLC, "HMI.Tension_Control.Torque_Setpoint", value);
        } catch (error) {
            winston.error(error.message);
        }
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