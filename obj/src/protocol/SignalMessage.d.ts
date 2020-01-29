import { IStream } from 'iqs-libs-protocols-node';
import { Message } from './Message';
export declare class SignalMessage extends Message {
    signal: number;
    timestamp: number;
    constructor();
    stream(stream: IStream): void;
}
