import {Tag} from 'ethernet-ip'
import {REAL, DINT, BOOL} from './TagNames'

const alarmTagName = "FAULT.Alarm_Register";
const resetAlarmTagName = "HMI.Fault_Reset_Main";


const logAlarm = (alarm) => {
    console.log(`THE ALARM VALUE IS _________________ ${alarm}`);
}

// const readAlarm = async function readAlarm(PLC, tagName, callback) {
//     let readableTag = new Tag(tagName, null, DINT);
//     await PLC.readTag(readableTag);
//     callback(readableTag.value);

// }




const Alarms = [
    {AlarmNumber: 700, AlarmName: "Drum VFD Fault"},
    {AlarmNumber: 701, AlarmName: "Take Up VFD Fault" },
    {AlarmNumber: 702, AlarmName: "TakeUp Communications Fault"},
    {AlarmNumber: 805, AlarmName: " Emergency Stop"},
    {AlarmNumber: 806, AlarmName:  "Pull Cord Fault"},
    ];


const findAlarm = (alarmValue) => {
    if (newAlarm === null) {
        console.log("The alarm was undefined")
        return
    }
    logAlarm(alarmValue);
    let newAlarm =  Alarms.find(o => o.AlarmNumber === alarmValue);

    newAlarm.TimeStamp = new Date();
    // callback(newAlarm);
    return Alarms.find(o => o.AlarmNumber === alarmValue);
};

// const readAlarm = (PLC, tagName, callback) => {
//     let readableTag = new Tag(tagName, null, DINT);
//     return new Promise((resolve, reject) => {
//         PLC.readTag(readableTag);
//         resolve(readableTag.value);
//     })
// }


var message = "";
const readAlarm = (PLC, tagName) => {
    let readableTag = new Tag(tagName, null, DINT);
    return new Promise(function(resolve, reject){
        PLC.readTag(readableTag).then(() => {
            resolve(readableTag.value);
        }).catch((err) => {
            console.log(err.message);
        });
    })
}


module.exports = {
   Alarms,
    findAlarm,
    readAlarm,
    alarmTagName,
    logAlarm,
    resetAlarmTagName
};