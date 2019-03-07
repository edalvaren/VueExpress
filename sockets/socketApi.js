
/** Socket IO API for real time communication **/
const socket_io = require('socket.io');
const io = socket_io();
const socketApi = {};

// All functions and constants found in our "FieldBus" module
const {fieldBus, hmiUpdateRate,
    findAlarm, readAlarm,
    TagObjArray, parseTag,
    WriteToReal, WriteToDint, WriteBoolFalse, WriteBoolTrue, ToggleBit} = require('../fieldBus');


const PlcTag = require('../models/plcTag');

// Configuration for winston logger
const winston = require('../config/winston');
socketApi.io = io;

const {Controller, TagGroup} = require('ethernet-ip');


// We will start by sending all tags with a default value. To do so we just copy the Tag object array
var initialTagCopy = true;
while (initialTagCopy){
    var shallowCopy = TagObjArray.slice();
    initialTagCopy = false;
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


    // Every second the tag array
    const updateTagArray = setInterval(function () {
        socketApi.sendTagValue(shallowCopy);
    }, hmiUpdateRate);

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
        // When the "Changed" event is fired by any tag we are subscribed to in the PLC
        tag.on("Changed", (tag, oldValue) => {
            // make sure the value is not empty
            if(!(tag.value === "Nan")){
            } else {
                // Find the tag that changed in our tag array by the tag Name property.
                let newTag = shallowCopy.find(o => o.name === tag.name);
                let index = shallowCopy.indexOf(newTag);
                if (index !== -1) {
                    // if the tag exists, we create a new PLC tag and replace the existing tag at that array position
                    let addedTag = new PlcTag(tag.name, null, parseTag(tag.value));
                    shallowCopy.splice(index, 1, addedTag);
                }
            }
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

    /**
     * SOCKET EVENT LISTENERS/HANDLERS
     * EVENTS:
     *   - READ_ALARMS  - Client started event requesting an updated alarm state.
     *     CLEAR_ALARMS - Clear alarm array and toggle reset bit.
     *     TOGGLE_START - Toggles the start button. Maintained in an ON State for 3 seconds
     *     TOGGLE_STOP  - Toggles the stop button. Maintained in an ON state for 3 seconds.
     *     CHANGE_SPEED - Update the value of the speed tag
     *     CHANGE_TORQUE - Update the value of the torque tag
     *     ERROR - Handles for a socket error
     *     DISCONNECTING - Logs reason for socket disconnection and stops sending the tag array via socket.
     */

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


    socket.on('error', (error) => {
       winston.error("There was an error. The error says: " + error.message)
    });

    socket.on('disconnecting', (reason) => {
        winston.warn(`The socket disconnected due to reasons: ${reason}`);
        clearInterval(updateTagArray);
    });
});

module.exports = socketApi;