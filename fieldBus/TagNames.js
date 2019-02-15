//module containing Datatypes
const {CIP} = require ('ethernet-ip/src/enip');

//TODO - Figure out if it's better to just import the types I need
let Types = CIP.DataTypes.Types;
const BOOL = Types.BOOL;
const REAL = Types.REAL;
const DINT = Types.DINT;


/* This prefix nonsense is just to avoid typing "Spiral_Drum." before each tag
* I think it turned out to be more work than it was worth. We'll see.
 */
const { DrumPrefix, TUPrefix, TensionControlPrefix } = require('./constants');
const Drum = DrumPrefix;
const TU = TUPrefix;
const TCS = TensionControlPrefix;

// const AllTags = {
//     [ Drum.concat("Status")
//
// }

const AllTags = {
    DrumStatus: {name: Drum.concat("Status"), dataType: DINT} ,
    DrumReady: {name: Drum.concat("VFD_Feedback_Ready"), dataType: BOOL},
    DrumSpeed: {name: Drum.concat("VFD_Feedback_Frequency"), dataType: REAL},
    DrumCurrent: {name: Drum.concat("VFD_Feedback_Current"), dataType: REAL},
    OutputTorque: {name: TCS.concat("Output_Torque"), dataType: REAL},
    SpeedScaling: {name: TCS.concat("Speed_Reference_Scaling"), dataType: REAL} ,
    Torque_SP: {name: TCS.concat("Torque_Setpoint"), dataType: REAL},
    AutoMode: {name: TCS.concat("Auto_Mode"), dataType: BOOL},
    TorqueMode: {name: TCS.concat("Torque_Mode"), dataType: BOOL},
    SpeedMode: {name: TCS.concat("Speed_Mode"), dataType: BOOL},
    TuReady: {name: TU.concat("VFD_Feedback_Ready"), dataType: BOOL},
    TuStatus: {name: TU.concat("Status"), dataType: DINT} ,
    TuSpeed: {name: TU.concat("VFD_Feedback_Frequency"), dataType: REAL},
    TuCurrent: {name: TU.concat("VFD_Feedback_Current"), dataType: REAL},
    StartSpiral: {name: "HMI.Start", dataType: BOOL},
    StopSpiral: {name: "HMI.Stop", dataType: BOOL},
    MainReset: {name: "HMI.Fault_Reset_Main", dataType: BOOL},
    LoadCellReading: {name: "Load_Cell_Percent", dataType: REAL},

};




/**
 * * Returns an array of keys for each
 * object.
 * i.e. const fruits = { apple: 28, orange: 17}
 * will return ['apple', 'orange']
 * @param arr
 * @returns {string[]}
 */



module.exports = {
AllTags
};
