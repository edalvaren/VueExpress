
const {Tag} = require('ethernet-ip');
const settings = require('./constants');

const ipAddress = settings.IPAddresses.StructureSupported;
const scanRate = settings.ScanRate;
const {AllTags_Names} = require('./TagNames');
const winston = require ('../config/winston');
/**
 *  Main function in this module.
 *       1. Subscribe to tags in TagList imported from TagNames.js
 *       2. Set the scan rate
 *       3. Connect to PLC
 *       4. Log PLC Name
 */





const InitializePLC = (PLC) => {
    try {
        SubscribeToTags(AllTags_Names, PLC);
        winston.info(`Subscribed to ${AllTags_Names.length} tags`);

    }
    catch (e) {
        winston.error("Subscribing to tags failed");
    }

    //default scan rate is 200ms. I assigned a scan rate of 1000ms
    PLC.connect(ipAddress, 0).then(() => {

        PLC.scan_rate = scanRate;
        const {name} = PLC.properties;
        winston.info(`\n\nConnected to PLC ${name}...\n`);
        PLC.scan()
            .catch((error) => {
                winston.error("There was a connection error. The error was caught though.. that's a good thing.. " + error.message)
            });
    })
        .catch((error) => {
            winston.error("There was an error while connecting to the PLC. The error says " + error.message);
        });
};



function readAllTagsOnce(group){
        group.forEach(tag=> {
            let thingy = tag.value.toString();
            console.log(thingy);
        });
}

const groupTags = (tags, group) => {
    tags.map(tag => {
        group.add(new Tag(tag.toString()));
        console.log(tag);
    })
};

const groupAllTags = (tags, group) => {
    return new Promise((resolve, reject) => {
        tags.map(tag => {
            group.add(new Tag(tag.toString()));
            console.log(tag);
        });
        resolve(group);
    })
};

const SubscribeToTags = (tags, PLC) => {
    return new Promise((resolve, reject) => {
        tags.map(tag => {
            PLC.subscribe(new Tag(tag.toString()))
        })
    })
};



module.exports = {
  InitializePLC, readAllTagsOnce, groupTags
};


