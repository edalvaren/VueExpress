import {REAL, DINT, BOOL} from './TagNames'
import {Tag} from 'ethernet-ip'


const WriteToDint = async function WriteToDint(PLC, tagName, tagValue){
    let writeableTag = new Tag(tagName, null, DINT);
    await PLC.writeTag(writeableTag, tagValue);
};

const WriteBoolTrue = async function WriteToBool(PLC, tagName){
    let writableTag = new Tag(tagName, null, BOOL);
    await PLC.writeTag(writableTag, true);
};
const WriteBoolFalse = async function WriteToBool(PLC, tagName){
    let writableTag = new Tag(tagName, null, BOOL);
    await PLC.writeTag(writableTag, false);
};
const ToggleBool = async function ToggleBool(PLC, tagName, tagValue){
    let writeableTag = new Tag(tagName, null, BOOL);
        await PLC.write
};

module.exports = {
    ToggleBool,
    WriteToDint,
    WriteBoolTrue,
    WriteBoolFalse
};