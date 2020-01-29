import { IStream } from 'iqs-libs-protocols-node';
import { IStreamable } from 'iqs-libs-protocols-node';
import { DataValue } from './DataValue';
export declare class Message implements IStreamable {
    protocol_version: number;
    type: number;
    org_id: string;
    gw_udi: string;
    device_udi: string;
    time: Date;
    protected constructor(messageType: number);
    stream(stream: IStream): void;
    protected streamCoordinate(stream: IStream, value: number): number;
    protected streamStrings(stream: IStream, values: string[]): string[];
    private isByteValue;
    protected streamDataValues(stream: IStream, values: DataValue[]): DataValue[];
}
