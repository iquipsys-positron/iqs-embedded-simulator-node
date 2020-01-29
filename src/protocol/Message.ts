const _ = require('lodash');

import { IStream } from 'iqs-libs-protocols-node';
import { IStreamable } from 'iqs-libs-protocols-node';

import { DataValue } from './DataValue';

export class Message implements IStreamable {
    public protocol_version: number = 1;

    public type: number;
    public org_id: string;
    public gw_udi: string;
    public device_udi: string;
    public time: Date;
    
    protected constructor(messageType: number) {
        this.type = messageType;
        this.time = new Date();
    }

    public stream(stream: IStream): void {
        this.type = stream.streamByte(this.type);

        if (this.protocol_version > 1) {
            this.org_id = stream.streamString(this.org_id);
            this.gw_udi = stream.streamString(this.gw_udi);
            this.device_udi = stream.streamString(this.device_udi);
            this.time = stream.streamDateTime(this.time);
        }
    }

    protected streamCoordinate(stream: IStream, value: number): number {
        value = value * 10000000;
        value = stream.streamInteger(value);
        return value / 10000000;
    }

    protected streamStrings(stream: IStream, values: string[]): string[] {
        values = values || [];
        let count = stream.streamByte(values.length);
        let result = [];
        for (let index = 0; index < count; index++) {
            let item = stream.streamString(values[index]);
            result.push(item);
        }
        return result;
    }

    private isByteValue(value: DataValue): boolean {
        return value.val >= 0 && value.val <= 0xFF;
    }

    protected streamDataValues(stream: IStream, values: DataValue[]): DataValue[] {
        let newDataValues: DataValue[] = [];

        // Save byte values
        let dataValues = _.filter(values, v => this.isByteValue(v));
        let dataValueCount = stream.streamByte(dataValues.length);
        for (let index = 0; index < dataValueCount; index++) {
            let dataValue: DataValue = dataValues[index];

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
            let dataValue: DataValue = dataValues[index];

            let id = dataValue ? dataValue.id : 0;
            id = stream.streamByte(id);

            let val = dataValue ? dataValue.val : 0;
            val = stream.streamInteger(val);

            newDataValues.push({ id: id, val: val });
        }

        return newDataValues;        
    }

}