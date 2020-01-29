import { IStream } from 'iqs-libs-protocols-node';
import { Message } from './Message';
export declare class ErrorMessage extends Message {
    code: number;
    message: string;
    constructor();
    stream(stream: IStream): void;
}
