import { IStream } from 'iqs-libs-protocols-node';
import { IStreamable } from 'iqs-libs-protocols-node';
import { PacketType } from './PacketType';

export class FmbMessage implements IStreamable {
    public packet_length: number;
    public packet_id: number;
    public packet_type: number;
    
    protected constructor() {
        this.packet_type = PacketType.NoAcknowledgement;
    }

    public stream(stream: IStream): void {
        this.packet_length = stream.streamWord(this.packet_length);
        this.packet_id = stream.streamWord(this.packet_id);
        this.packet_type = stream.streamByte(this.packet_type);
    }

}