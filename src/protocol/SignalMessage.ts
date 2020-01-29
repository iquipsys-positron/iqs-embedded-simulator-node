import { IStream } from 'iqs-libs-protocols-node';
import { Message } from './Message';

export class SignalMessage extends Message {
    public signal: number;
    public timestamp: number;

    public constructor() {
        super(4);
    }

    public stream(stream: IStream): void {
        super.stream(stream);
        
        this.signal = stream.streamByte(this.signal);
        this.timestamp = stream.streamDWord(this.timestamp);
    }
    
}