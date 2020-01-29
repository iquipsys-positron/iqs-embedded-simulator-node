import { IStream } from 'iqs-libs-protocols-node';
import { Message } from './Message';
import { DataValue } from './DataValue';
export declare class CommandMessage extends Message {
    timestamp: number;
    commands: DataValue[];
    constructor();
    stream(stream: IStream): void;
}
