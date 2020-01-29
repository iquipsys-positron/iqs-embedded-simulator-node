import { IStream } from 'iqs-libs-protocols-node';
import { Message } from './Message';
import { DataValue } from './DataValue';

export class StateUpdateMessage2 extends Message {
    public data_version: number;
    public lat: number;
    public lng: number;
    public alt: number;
    public angle: number;
    public speed: number;
    public params: DataValue[];
    public events: DataValue[];
    public beacons: string[];

    public constructor() {
        super(11);
    }

    public stream(stream: IStream): void {
        super.stream(stream);
        
        this.data_version = stream.streamByte(this.data_version);

        this.lat = this.streamCoordinate(stream, this.lat);
        this.lng = this.streamCoordinate(stream, this.lng);
        this.alt = stream.streamInteger(this.alt);
        this.angle = stream.streamWord(this.angle);
        this.speed = stream.streamWord(this.speed);
                
        if (this.lat == 0 && this.lng == 0) {
            this.lat = this.lng = this.alt = this.angle = this.speed = null;
        }

        this.params = this.streamDataValues(stream, this.params);
        this.events = this.streamDataValues(stream, this.events);

        this.beacons = this.streamStrings(stream, this.beacons);
    }
    
}