import { IStream } from 'iqs-libs-protocols-node';
import { IStreamable } from 'iqs-libs-protocols-node';

import { FmbMessage } from './FmbMessage';
import { PacketType } from './PacketType';

export class AvlResponseFmbMessage extends FmbMessage {
    public avl_packet_id: number;
    public avl_elements: number;

    public constructor() {
        super();

        this.packet_length = 5;
        this.packet_id = 0;
        this.packet_type = PacketType.NoAcknowledgement;
    }

    public stream(stream: IStream): void {
        super.stream(stream);

        this.avl_packet_id = stream.streamByte(this.avl_packet_id);
        this.avl_elements = stream.streamByte(this.avl_elements);
    }
    
}