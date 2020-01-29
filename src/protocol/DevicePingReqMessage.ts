import { IStream } from 'iqs-libs-protocols-node';
import { Message } from './Message';

export class DevicePingReqMessage extends Message {
    public timestamp: number;

    public constructor() {
        super(8);
    }

    public stream(stream: IStream): void {
        super.stream(stream);

        this.timestamp = stream.streamDWord(this.timestamp);
    }
    
}