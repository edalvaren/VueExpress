/** alarm.js **/

function Alarm(AlarmNumber, AlarmName, AlarmStatus, TimeStamp){
    this.AlarmName = AlarmName || null;
    this.AlarmNumber = AlarmNumber || null;
    this.AlarmStatus = AlarmStatus || null;
    this.TimeStamp = TimeStamp;
}

Alarm.prototype.getAlarmName = function(){
    return this.AlarmName;
};

Alarm.prototype.setAlarmName = function (name) {
    this.AlarmName = name;
};

Alarm.prototype.getAlarmNumber = function(){
    return this.AlarmNumber;
};
Alarm.prototype.setAlarmNumber = function (alarmNumber) {
    this.AlarmNumber = alarmNumber;
};
Alarm.prototype.getAlarmStatus = function(){
    return this.AlarmStatus;
};
Alarm.prototype.setAlarmStatus = function (alarmStatus) {
    this.AlarmStatus = alarmStatus;
};
Alarm.prototype.getAlarmTime = function(){
    return this.TimeStamp;
};
Alarm.prototype.setAlarmTime = function (timeStamp) {
    this.TimeStamp = timeStamp;
};
Alarm.prototype.equals = function (otherAlarm) {
    return otherAlarm.getAlarmName() === this.getAlarmName()
        && otherTag.getAlarmNumber() === this.getAlarmNumber();
};


Alarm.prototype.fill = function (newFields) {
    for (let field in newFields) {
        if (this.hasOwnProperty(field) && newFields.hasOwnProperty(field)){
            if (this[field] !== 'undefined') {
                this[field] = newFields[field];
            }
        }
    }
};


module.exports = Alarm;

