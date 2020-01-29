import { IoElement } from './IoElement';

export class AvlData {
    public time: Date; // 8 bytes
    public priority: number; // 1 byte
    public lng: number; // 4 bytes
    public lat: number; // 4 bytes
    public alt: number; // 2 bytes
    public angle: number; // 2 bytes
    public satellites: number; // 1 byte
    public speed: number; // 2 bytes
    public event_id: number; // 1 byte
    public io_elements: IoElement[] = [];
}