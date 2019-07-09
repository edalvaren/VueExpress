
const updateTags = (tag) => {
    tag.on("Changed", (tag, lastValue) => {
    });
};

const parseTag = (tagVal) => {
    return parseFloat(Math.round(tagVal*10)/10).toFixed(2)

};



const ParseNames = (obj) => {

};



module.exports = {updateTags, parseTag};