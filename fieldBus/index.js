

/**     Functions
 *      1. Get Connected to PLC
 *      2. Catch Connection Errors gracefully
 *      2.1 Automatic Reconnection???
 *
 *      SUBSCRIBE to tag or tag group?
 *
 *      READ TAGS INDIVIDUALLY?
 *          await PLC.readTag(fooTag);
 *          console.log(fooTag.value);
 *
 *      READ TAGS AS A GROUP
 *          const group = new TagGroup();
 *          group.add(new Tag("contTag")); //controller scope tag
 *          PLC.connect(.... )
 *              await PLC.readTagGroup(group);
 *          group.forEach(tag => {
 *              console.log(tag.value);
 *          }
 *      WRITING TAGS INDIVIDUALLY
 *      const { DINT, BOOL } = EthernetIP.CIP.DataTypes.Types;
 *      const fooTag = new Tag("myTag", null, DINT)
 *      await PLC.writeTag(fooTag)
 **/


const {InitializePLC, readAllTagsOnce, groupTags} = require('./plcConnect');

const fieldBus = (Compact) => {
   InitializePLC(Compact);
};


module.exports = {
  fieldBus, readAllTagsOnce, groupTags
};





