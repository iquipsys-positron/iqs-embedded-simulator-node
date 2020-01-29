import { IStream } from 'iqs-libs-protocols-node';
import { Message } from './Message';
import { DataValue } from './DataValue';
export declare class StateUpdateMessage2 extends Message {
    data_version: number;
    lat: number;
    lng: number;
    alt: number;
    angle: number;
    speed: number;
    params: DataValue[];
    events: DataValue[];
    beacons: string[];
    constructor();
    stream(stream: IStream): void;
}
