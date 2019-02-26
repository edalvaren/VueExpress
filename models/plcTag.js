/** plcTag.js **/

function PlcTag(name, dataType, value){
   this.name = name || null;
   this.dataType = dataType || null;
   this.value = value || null;
}

PlcTag.prototype.getName = function(){
    return this.name;
};

PlcTag.prototype.setName = function (name) {
    this.name = name;
};

PlcTag.prototype.getValue = function(){
    return this.value;
};
PlcTag.prototype.setValue = function (value) {
    this.value = value;
};
PlcTag.prototype.getDataType = function(){
    return this.dataType;
};
PlcTag.prototype.setDataType = function (dataType) {
    this.dataType = dataType;
};

PlcTag.prototype.equals = function (otherTag) {
    return otherTag.getName() === this.getName()
        && otherTag.getDataType() === this.getDataType();
};

PlcTag.prototype.fill = function (newFields) {
  for (let field in newFields) {
      if (this.hasOwnProperty(field) && newFields.hasOwnProperty(field)){
          if (this[field] !== 'undefined') {
              this[field] = newFields[field];
          }
      }
  }
};

// PlcTag.findById = function (id, callback) {
//     db.get('users', {id: id}).run(function (err, data) {
//         if (err) return callback(err);
//         callback(null, new PlcTag(data));
//     });
// }


module.exports = PlcTag;

// const Tags = function (data) {
//   this.data = data;
// };
//
// Tags.prototype.data = {};
//
// Tags.prototype.changeName = function (name) {
//     this.data.name = name;
// };