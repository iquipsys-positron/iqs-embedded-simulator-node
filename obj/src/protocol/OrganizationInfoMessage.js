"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("./Message");
class OrganizationInfoMessage extends Message_1.Message {
    constructor() {
        super(2);
        this.active_int = 30;
        this.inactive_int = 300;
        this.offsite_int = 900;
    }
    stream(stream) {
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
exports.OrganizationInfoMessage = OrganizationInfoMessage;
//# sourceMappingURL=OrganizationInfoMessage.js.map