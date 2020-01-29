import { IStream } from 'iqs-libs-protocols-node';
import { Message } from './Message';

export class DeviceInitMessage extends Message {
    public device_version: number;
    public data_version: number;

    public constructor() {
        super(1);
    }

    public stream(stream: IStream): void {
        super.stream(stream);

        this.device_version = stream.streamByte(this.device_version);
        this.data_version = stream.streamByte(this.data_version);
    }
    
}