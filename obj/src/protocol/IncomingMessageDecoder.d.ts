/// <reference types="node" />
import { Message } from './Message';
export declare class IncomingMessageDecoder {
    static decode(buffer: Buffer, protocolVersion: number): Message;
}
