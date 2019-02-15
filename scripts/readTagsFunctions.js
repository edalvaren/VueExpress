const {Controller, Tag} = require('ethernet-ip');
const { DrumPrefix, TUPrefix, TensionControlPrefix } = require('./constants');

const settings = require('./constants');
const ipAddress = settings.IPAddresses.StructureSupported;


// const readTagPromise = (tag) => {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             resolve(tag);
//         }, 1000);
//     })
// };

async function readTagSingle(Controller, Tag){
    await Controller.readTag(Tag)
}

const TorqueTag = new Tag(TensionControlPrefix.concat("Torque_Setpoint"));
const PLC = new Controller();

PLC.connect(ipAddress, 0).then(async () => {
    await PLC.readTag(TorqueTag);
    console.log(TorqueTag.name);
    console.log(TorqueTag.value)
}).catch((err) => {
    console.log(`Connection to PLC failed. Error returned = ${err.message}`);
    });

