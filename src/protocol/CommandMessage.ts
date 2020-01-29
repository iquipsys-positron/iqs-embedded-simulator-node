import { IStream } from 'iqs-libs-protocols-node';
import { Message } from './Message';
import { DataValue } from './DataValue';

export class CommandMessage extends Message {
    public timestamp: number;
    public commands: DataValue[];

    public constructor() {
        super(12);
    }

    public stream(stream: IStream): void {
        super.stream(stream);
        
        this.timestamp = stream.streamDWord(this.timestamp);
        this.commands = this.streamDataValues(stream, this.commands);
    }

}