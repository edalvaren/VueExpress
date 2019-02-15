
const logger = require('morgan');
const {Tag} = require('ethernet-ip');
const settings = require('./constants');

const ipAddress = settings.IPAddresses.StructureSupported;
const scanRate = settings.ScanRate;

const {AllTags} = require('./TagNames');
const {getArrayValues, getTagName} = require('../helpers/arrayFunctions');


/**
 *  Main function in this module.
 *       1. Subscribe to tags in TagList imported from TagNames.js
 *       2. Set the scan rate
 *       3. Connect to PLC
 *       4. Log PLC Name
 */

//1)  Extract the values of the Object Array
const AllTags_Values = getArrayValues(AllTags);
//2) Extract tag names of the values array
const AllTags_Names = AllTags_Values.map(getTagName);



const InitializePLC = (PLC) => {
    try {
        SubscribeToTags(AllTags_Names, PLC);

        console.log("It worked!! /n");

    }
    catch (e) {
        console.log(`Caught Error when trying to subscribe to Tags. Error is ${e.message}It did not work /n)`);
    }
    
    //default scan rate is 200ms. I assigned a scan rate of 1000ms
    PLC.connect(ipAddress, 0).then(() => {
        PLC.scan_rate = scanRate;
        const {name} = PLC.properties;
        console.log(`\n\nConnected to PLC ${name}...\n`);
        PLC.scan();
    });


};



const SubscribeToTags = (tags, PLC) => {
    return new Promise((resolve, reject) => {
        tags.map(tag => {
            PLC.subscribe(new Tag(tag.toString()))
            console.log(`subscribing to ${tag}`);
        })
    })
};




module.exports = {
  InitializePLC
};

