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


module.exports = PlcTag;

