import { IStream } from 'iqs-libs-protocols-node';
import { Message } from './Message';
export declare class DevicePingMessage extends Message {
    constructor();
    stream(stream: IStream): void;
}
