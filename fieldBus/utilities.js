/**
 * Logs tags when they are initialized
 * @param tag
 * @constructor
 */
const logTags = (tag) => {
    tag.on("Initialized", tag => {
        console.log("Initialized", tag.value);
    });
    process.stdout.write("Initialized");

};

const updateTags = (tag) => {
    tag.on("Changed", (tag, lastValue) => {
        console.log(`${tag.name} changed from ${lastValue} -> ${tag.value}\n`);
    });
};

const parseTag = (tagVal) => {
    return parseFloat(Math.round(tagVal*10)/10).toFixed(2)

};



const ParseNames = (obj) => {

};



module.exports = {logTags, updateTags, parseTag};