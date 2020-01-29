import { IStream } from 'iqs-libs-protocols-node';
import { Message } from './Message';
export declare class DeviceInitMessage extends Message {
    device_version: number;
    data_version: number;
    constructor();
    stream(stream: IStream): void;
}
