import { IStream } from 'iqs-libs-protocols-node';
import { Message } from './Message';

export class DevicePingMessage extends Message {

    public constructor() {
        super(7);
    }

    public stream(stream: IStream): void {
        super.stream(stream);
    }
    
}