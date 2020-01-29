import { IStream } from 'iqs-libs-protocols-node';
import { FmbMessage } from './FmbMessage';
export declare class AvlResponseFmbMessage extends FmbMessage {
    avl_packet_id: number;
    avl_elements: number;
    constructor();
    stream(stream: IStream): void;
}
