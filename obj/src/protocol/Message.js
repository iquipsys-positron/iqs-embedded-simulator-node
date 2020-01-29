"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require('lodash');
class Message {
    constructor(messageType) {
        this.protocol_version = 1;
        this.type = messageType;
        this.time = new Date();
    }
    stream(stream) {
        this.type = stream.streamByte(this.type);
        if (this.protocol_version > 1) {
            this.org_id = stream.streamString(this.org_id);
            this.gw_udi = stream.streamString(this.gw_udi);
            this.device_udi = stream.streamString(this.device_udi);
            this.time = stream.streamDateTime(this.time);
        }
    }
    streamCoordinate(stream, value) {
        value = value * 10000000;
        value = stream.streamInteger(value);
        return value / 10000000;
    }
    streamStrings(stream, values) {
        values = values || [];
        let count = stream.streamByte(values.length);
        let result = [];
        for (let index = 0; index < count; index++) {
            let item = stream.streamString(values[index]);
            result.push(item);
        }
        return result;
    }
    isByteValue(value) {
        return value.val >= 0 && value.val <= 0xFF;
    }
    streamDataValues(stream, values) {
        let newDataValues = [];
        // Save byte values
        let dataValues = _.filter(values, v => this.isByteValue(v));
        let dataValueCount = stream.streamByte(dataValues.length);
        for (let index = 0; index < dataValueCount; index++) {
            let dataValue = dataValues[index];
            let id = dataValue ? dataValue.id : 0;
            id = stream.streamByte(id);
            let val = dataValue ? dataValue.val : 0;
            val = stream.streamByte(val);
            newDataValues.push({ id: id, val: val });
        }
        // Save int values
        dataValues = _.filter(values, v => !this.isByteValue(v));
        dataValueCount = stream.streamByte(dataValues.length);
        for (let index = 0; index < dataValueCount; index++) {
            let dataValue = dataValues[index];
            let id = dataValue ? dataValue.id : 0;
            id = stream.streamByte(id);
            let val = dataValue ? dataValue.val : 0;
            val = stream.streamInteger(val);
            newDataValues.push({ id: id, val: val });
        }
        return newDataValues;
    }
}
exports.Message = Message;
//# sourceMappingURL=Message.js.map