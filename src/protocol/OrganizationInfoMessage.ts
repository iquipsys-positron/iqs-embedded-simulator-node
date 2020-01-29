import { IStream } from 'iqs-libs-protocols-node';
import { Message } from './Message';

export class OrganizationInfoMessage extends Message {
    public data_version: number;
    public center_lat: number;
    public center_lng: number;
    public radius: number;
    public active_int: number;
    public inactive_int: number;
    public offsite_int: number;
    public data_rate: number;

    public constructor() {
        super(2);

        this.active_int = 30;
        this.inactive_int = 300;
        this.offsite_int = 900;
    }

    public stream(stream: IStream): void {
        super.stream(stream);

        this.data_version = stream.streamByte(this.data_version);
        this.center_lat = this.streamCoordinate(stream, this.center_lat);
        this.center_lng = this.streamCoordinate(stream, this.center_lng);
        this.radius = stream.streamByte(this.radius);
        this.active_int = stream.streamWord(this.active_int);
        this.inactive_int = stream.streamWord(this.inactive_int);
        this.offsite_int = stream.streamWord(this.offsite_int);
        this.data_rate = stream.streamByte(this.data_rate);
    }
    
}