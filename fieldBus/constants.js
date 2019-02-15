
const IPAddresses = {
    StructureSupported: "172.16.30.55",
    SelfStacker: "172.16.30.41",
    MicroLogixDataCollector: "172.16.31.14",
    MicroLogixFreezer: "172.16.30.40"
};

const ScanRate = 1000;
const DrumPrefix = "Spiral_Drum.";
const TUPrefix = "Spiral_Takeup.";
const TensionControlPrefix = "HMI.Tension_Control.";

module.exports = {
   IPAddresses,
   ScanRate,
    DrumPrefix,
    TUPrefix,
    TensionControlPrefix
};