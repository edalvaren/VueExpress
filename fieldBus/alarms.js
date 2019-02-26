import {Tag} from 'ethernet-ip'
import {REAL, DINT, BOOL} from './TagNames'

const alarmTagName = "FAULT.Alarm_Register";

const readAlarm = async function ReadTagSingle(PLC, tagName, callback){
    let readableTag = new Tag(tagName, null, DINT);
    await PLC.readTag(readableTag);
    return callback(readableTag.value);
};

const Alarms = [
    {AlarmNumber: 700, AlarmName: "Drum VFD Fault"},
    {AlarmNumber: 701, AlarmName: "Take Up VFD Fault" },
    {AlarmNumber: 702, AlarmName: "TakeUp Communications Fault"},
    {AlarmNumber: 805, AlarmName: " Emergency Stop"},
    {AlarmNumber: 806, AlarmName:  "Pull Cord Fault"},
    ];


const findAlarm = (alarmValue) => {
    return Alarms.find(o => o.AlarmNumber === alarmValue);
};

module.exports = {
   Alarms,
    findAlarm,
    readAlarm,
    alarmTagName

};