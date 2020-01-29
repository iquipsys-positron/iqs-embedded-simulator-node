import { FmbMessage } from './FmbMessage';
import { PacketType } from './PacketType';

export class AckFmbMessage extends FmbMessage {
    
    public constructor() {
        super();

        this.packet_length = 3;
        this.packet_type = PacketType.Acknowledgement;
        this.packet_id = 0;
    }

}