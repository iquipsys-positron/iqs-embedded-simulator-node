import { IStream } from 'iqs-libs-protocols-node';
import { Message } from './Message';
export declare class DevicePingReqMessage extends Message {
    timestamp: number;
    constructor();
    stream(stream: IStream): void;
}
