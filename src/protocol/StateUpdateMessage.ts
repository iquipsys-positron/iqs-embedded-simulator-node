import { IStream } from 'iqs-libs-protocols-node';
import { Message } from './Message';

export class StateUpdateMessage extends Message {
    public data_version: number;
    public freezed: boolean;
    public pressed: boolean;
    public long_pressed: boolean;
    public lat: number;
    public lng: number;
    public alt: number;
    public angle: number;
    public speed: number;
    public quality: number;
    public power: boolean;
    public beacons: string[];

    public constructor() {
        super(3);
    }

    public stream(stream: IStream): void {
        super.stream(stream);
        
        this.data_version = stream.streamByte(this.data_version);

        let state: number = this.freezed ? 1 : 0;
        state |= this.pressed ? 2 : 0;
        state |= this.long_pressed ? 4 : 0;
        state = stream.streamByte(state);
        this.freezed = (state & 1) != 0;
        this.pressed = (state & 2) != 0;
        this.long_pressed = (state & 4) != 0;

        this.lat = this.streamCoordinate(stream, this.lat);
        this.lng = this.streamCoordinate(stream, this.lng);
        this.alt = stream.streamInteger(this.alt);
        this.angle = stream.streamWord(this.angle);
        this.speed = stream.streamWord(this.speed);
        this.quality = stream.streamByte(this.quality);
                
        if (this.lat == 0 && this.lng == 0) {
            this.lat = this.lng = this.alt = this.angle = this.speed = this.quality = null;
        }

        this.beacons = this.streamStrings(stream, this.beacons);
    }
    
}