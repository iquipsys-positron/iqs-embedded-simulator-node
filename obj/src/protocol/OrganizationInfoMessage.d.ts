import { IStream } from 'iqs-libs-protocols-node';
import { Message } from './Message';
export declare class OrganizationInfoMessage extends Message {
    data_version: number;
    center_lat: number;
    center_lng: number;
    radius: number;
    active_int: number;
    inactive_int: number;
    offsite_int: number;
    data_rate: number;
    constructor();
    stream(stream: IStream): void;
}
