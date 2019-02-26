
/**
 * * Returns an array of keys for each
 * object.
 * i.e. const fruits = { apple: 28, orange: 17}
 * will return ['apple', 'orange']
 * @param arr
 * @returns {string[]}
 */

const getKeys = (arr) => {
     return Object.keys(arr);
};


/**
 * Creates an array that contains the value of every property in an object.
 * @param arr
 * @returns {any[]}
 */
const getArrayValues = (arr) => {
    return Object.values(arr);
};


const getTagName = (item) => {
   return [item.name];
};



module.exports = {
  getKeys, getTagName, getArrayValues
};




/*
* 1. Make into values
* values = {
* {name: "" , dataType: 'REAL'}
* .... etc.
* }
* 2. make a function that does what i want
* example ----
*       function getTagName(item,index){
*       var tagName = [item.name];
*       return tagName;
*       }
*  3. then you pass that function as the callback argument to the map function
*  example ---
*       var newArray = values.Map(getTagName);
*
*  newARray would be an array of names
*  [['HMI.Tension_Control.Output_Torque'],
*
*
*  4. After that
*
 */