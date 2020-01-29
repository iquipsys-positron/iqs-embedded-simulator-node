import { IStream } from 'iqs-libs-protocols-node';
import { IStreamable } from 'iqs-libs-protocols-node';
export declare class FmbMessage implements IStreamable {
    packet_length: number;
    packet_id: number;
    packet_type: number;
    protected constructor();
    stream(stream: IStream): void;
}
