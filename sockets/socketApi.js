
/** Socket IO API for real time communication **/
const socket_io = require('socket.io');
const io = socket_io();
const socketApi = {};

// All functions and constants found in our "FieldBus" module
const {fieldBus, hmiUpdateRate,
    findAlarm, readAlarm, resetAlarmTagName, alarmTagName, AlarmObjArr, alarmEthTag, clearAlarms,
    TagObjArray, parseTag,
    WriteToReal, WriteToDint, WriteBoolFalse, WriteBoolTrue, ToggleBit} = require('../fieldBus');

const AlarmObj = require('../models/alarm');
const PlcTag = require('../models/plcTag');

// Configuration for winston logger
const winston = require('../config/winston');
socketApi.io = io;

const {Controller, Tag, TagGroup} = require('ethernet-ip');


// We will start by sending all tags with a default value. To do so we just copy the Tag object array
var initialTagCopy = true;
while (initialTagCopy){
    var shallowCopy = TagObjArray.slice();
    var alarmShallowCopy = AlarmObjArr.slice();
    initialTagCopy = false;
}

var activeAlarms = [];

function replaceArrayElement(element, index, array) {

}

io.on('connection', function (socket) {
    winston.info(`Socket with ID ${socket.id} connected`);
    const PLC = new Controller();
    const tagGroup = new TagGroup();

    fieldBus(PLC);

    const readAlarmTag = setInterval(async function () {
        await PLC.readTag(alarmEthTag);
    }, 1500);

    const logReadAlarm = setInterval( function () {
        // if (alarmEthTag.value != 0) {
        let newAlarm = alarmShallowCopy.find(o => o.AlarmNumber === alarmEthTag.value);
        if (typeof newAlarm !== 'undefined' ){
        let index = alarmShallowCopy.indexOf(newAlarm);
        let addedAlarm = new AlarmObj(newAlarm.AlarmNumber, newAlarm.AlarmName, true);
        addedAlarm.setAlarmTime(new Date());
        alarmShallowCopy.splice(index, 1, addedAlarm);
        } else {
            console.log(`there are no alarms!\n`);
            return
        }
        winston.info(`Found new alarm with name ${newAlarm.AlarmName}... with value: ${newAlarm.AlarmNumber}\n`);
    }, 2000);


    socketApi.sendTagValue = function(tags) {
        io.sockets.emit('TAG', tags);
        // winston.info(`the value being sent is ${tags[19].value.toString()}`)
    };

    socketApi.sendAlarm = function(msg) {
       io.sockets.emit('ALARM', msg);
        // winston.warn(msg);
    };

    socketApi.sendActiveAlarm = function(msg){
       io.sockets.emit('ALARM_NUM', msg);
        // winston.warn(msg);
    };
    socketApi.writeTagValue = function(tag) {
      io.sockets.emit('WRITE_TAG', tag)
    };
    // Every second the tag array is sent via sockets
    const updateTagArray = setInterval(function () {
        socketApi.sendTagValue(shallowCopy);
    }, hmiUpdateRate);

    const updateAlarmArray = setInterval(function () {
        socketApi.sendAlarm(alarmShallowCopy);
    }, 1800);

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
            // if(!(tag.value === "Nan")){
            // } else {
            // Find the tag that changed in our tag array by the tag Name property.
            let newTag = shallowCopy.find(o => o.name === tag.name);
            let index = shallowCopy.indexOf(newTag);
            if (index !== -1) {
                // if the tag exists, we create a new PLC tag and replace the existing tag at that array position
                let addedTag = new PlcTag(tag.name, null, parseTag(tag.value));
                shallowCopy.splice(index, 1, addedTag);
            }
        });
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
        let readAl = readAlarm(PLC, alarmTagName);
        readAl.then(function(result){
            if (activeAlarms.indexOf(result) === -1){
                activeAlarms.push(result);
                let myAlarm = findAlarm(result);
                socketApi.sendAlarm(myAlarm);
            }
        })
    });
    socket.on('CLEAR_ALARMS', function () {
        winston.info(`Cleared all active alarms}`)
        ToggleBit(resetAlarmTagName, PLC);
        shallowCopy.forEach(function(item){
            let index = shallowCopy.indexOf(item);
            let clearedAlarm = new AlarmObj(item.AlarmNumber, item.AlarmName, false, null);
            alarmShallowCopy.splice(index, 1, clearedAlarm);
        })
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
        clearInterval(updateAlarmArray);
    });
});

module.exports = socketApi;