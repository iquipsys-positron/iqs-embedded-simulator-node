let _ = require('lodash');

import { IStream } from 'iqs-libs-protocols-node';
import { IStreamable } from 'iqs-libs-protocols-node';

import { FmbMessage } from './FmbMessage';
import { PacketType } from './PacketType';
import { AvlData } from './AvlData';
import { IoElement } from './IoElement';

export class AvlDataFmbMessage extends FmbMessage {
    public avl_packet_id: number;
    public device_udi: string;
    public avl_data: AvlData[] = [];

    public constructor() {
        super();

        this.packet_length = 0;
        this.packet_id = 0;
        this.packet_type = PacketType.NoAcknowledgement;
    }

    public stream(stream: IStream): void {
        this.packet_length = this.calculatePacketLength();

        super.stream(stream);

        this.avl_packet_id = stream.streamByte(this.avl_packet_id);
        stream.streamByte(0); // Hack to change 2 byte string length down to 1
        this.device_udi = stream.streamString(this.device_udi);

        this.avl_data = this.streamAvlDataArray(stream, this.avl_data);
    }

    private calculatePacketLength(): number {
        let deviceUdiLength = (this.device_udi || '').length + 2;

        let result = 3 + 1 + deviceUdiLength + 3;

        for (let avlData of this.avl_data || []) {
            result += 24 + 6;
            for (let ioElement of avlData.io_elements || []) {
                result += 1 + ioElement.size;
            }
        }

        return result;
    }
    
    private streamCoordinate(stream: IStream, value: number): number {
        return stream.streamInteger(value * 10000000) / 10000000;
    }

    private streamTimestamp(stream: IStream, value: Date): Date {
        let timestamp = value != null ? value.getTime() : 0;
        return new Date(stream.streamQWord(timestamp));
    }

    private streamAvlDataArray(stream: IStream, values: AvlData[]): AvlData[] {
        // Codec ID
        stream.streamByte(8);

        values = values || [];
        // Number of Data
        let count = stream.streamByte(values.length);
        let result = [];
        for (let index = 0; index < count; index++) {
            let item = this.streamAvlData(stream, values[index]);
            result.push(item);
        }
        // Repeat Number of Data
        stream.streamByte(values.length);
        return result;
    }

    private streamAvlData(stream: IStream, value: AvlData): AvlData {
        value = value || new AvlData();
        value.time = this.streamTimestamp(stream, value.time);
        value.priority = stream.streamByte(value.priority);

        value.lng = this.streamCoordinate(stream, value.lng);
        value.lat = this.streamCoordinate(stream, value.lat);
        value.alt = stream.streamShort(value.alt);
        value.angle = stream.streamWord(value.angle);
        value.satellites = stream.streamByte(value.satellites);
        value.speed = stream.streamWord(value.speed);

        value.event_id = stream.streamByte(value.event_id);

        value.io_elements = value.io_elements || [];
        stream.streamByte(value.io_elements.length);

        let elements = [];
        let elements1 = this.streamIoElementArray(stream, value.io_elements, 1);
        elements.push(...elements1);
        let elements2 = this.streamIoElementArray(stream, value.io_elements, 2);
        elements.push(...elements2);
        let elements4 = this.streamIoElementArray(stream, value.io_elements, 4);
        elements.push(...elements4);
        let elements8 = this.streamIoElementArray(stream, value.io_elements, 8);
        elements.push(...elements8);

        value.io_elements = elements;

        return value;
    }

    private streamIoElementArray(stream: IStream, values: IoElement[], size: number): IoElement[] {
        values = _.filter(values, v => v.size == size);
        let count = stream.streamByte(values.length);
        let result: IoElement[] = [];
        for (let index = 0; index < count; index++) {
            let element = this.streamIoElement(stream, values[index], size);
            result.push(element);
        }
        return result;
    }

    private streamIoElement(stream: IStream, value: IoElement, size: number): IoElement {
        value = value || new IoElement();
        value.id = stream.streamByte(value.id);
        switch (size) {
            case 1:
                value.value = stream.streamByte(value.value);
                break;
            case 2:
                value.value = stream.streamWord(value.value);
                break;
            case 4:
                value.value = stream.streamDWord(value.value);
                break;
            case 8:
                value.value = stream.streamQWord(value.value);
                break;
        }
        value.size = size;
        return value;
    }

}