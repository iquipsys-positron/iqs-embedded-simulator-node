import { IStream } from 'iqs-libs-protocols-node';
import { FmbMessage } from './FmbMessage';
import { AvlData } from './AvlData';
export declare class AvlDataFmbMessage extends FmbMessage {
    avl_packet_id: number;
    device_udi: string;
    avl_data: AvlData[];
    constructor();
    stream(stream: IStream): void;
    private calculatePacketLength;
    private streamCoordinate;
    private streamTimestamp;
    private streamAvlDataArray;
    private streamAvlData;
    private streamIoElementArray;
    private streamIoElement;
}
