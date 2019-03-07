import {REAL, DINT, BOOL} from './TagNames'
import {Tag} from 'ethernet-ip'


const WriteToDint = async function WriteToDint(PLC, tagName, tagValue){
    let writeableTag = new Tag(tagName, null, DINT);
    await PLC.writeTag(writeableTag, tagValue);
};

const WriteToReal = async function WriteToReal(PLC, tagName, tagValue){
    let writeableTag = new Tag(tagName, null, REAL);
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

function ToggleBit(tagName, PLC) {
    WriteBoolTrue(PLC, tagName);
    setTimeout(WriteBoolFalse, 2000, PLC, "HMI.Fault_Reset_Main");
}

module.exports = {
    WriteToDint,
    WriteBoolTrue,
    WriteBoolFalse,
    ToggleBit,
    WriteToReal
};