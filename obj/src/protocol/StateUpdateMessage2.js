"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("./Message");
class StateUpdateMessage2 extends Message_1.Message {
    constructor() {
        super(11);
    }
    stream(stream) {
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
exports.StateUpdateMessage2 = StateUpdateMessage2;
//# sourceMappingURL=StateUpdateMessage2.js.map