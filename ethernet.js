
const { Tag} = require('ethernet-ip');

module.exports = function(PLC) {
    //step 1 : Import ethernet Ip module
//step 2: instantiate new controller object
    const ipAddress = "172.16.30.55";
    const endOfLine = require('os').EOL;
//define tags
    const SpeedTag = "test_float";
    const LoadCellTag = "test_timer.ACC";
//define tags
//subscribe to tags

    PLC.subscribe(new Tag(SpeedTag));
    // PLC.subscribe(new Tag(LoadCellTag));
    PLC.connect(ipAddress, 0).then(() => {
        // Set Scan Rate of Subscription Group to 50 ms (defaults to 200 ms)
        PLC.scan_rate = 1000;
        PLC.scan();
    });
};




//step 1 : Import ethernet Ip module
//step 2: instantiate new controller object


// exports.SubscribeToTags = () => {
//     return new Promise((resolve, reject) => {
//         PLC.subscribe(new Tag(SpeedTag));
//         PLC.subscribe(new Tag(LoadCellTag));
//         eth.emit("Subscribed", SpeedTag, LoadCellTag);
//         resolve(PLC);
//     });
// };



//
// exports.CyclicScan = (PLC) => {
//     PLC.forEach(tag => {
//         // Called on the First Successful Read from the Controller
//         tag.on("Initialized", tag => {
//             eth.emit("Initialized");
//             console.log("Initialized", tag.value);
//         });
//         process.stdout.write("Initialized");
//
//         // Called if Tag.controller_value changes
//         tag.on("Changed", (tag, oldValue) => {
//             eth.emit("Changed", (tag));
//             process.stdout.write(`The tag changed to ${tag.value} ${endOfLine}`);
// }
//
//
//             console.log("Changed:", tag.value);
//
//
//

