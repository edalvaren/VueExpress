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

const parseTag = (tag) => {
    return {
        name: tag.name,
        value: parseFloat(Math.round(tag.value*100)/100).toFixed(2)
    };
};

module.exports = {logTags, updateTags, parseTag};