"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PacketType_1 = require("./PacketType");
class FmbMessage {
    constructor() {
        this.packet_type = PacketType_1.PacketType.NoAcknowledgement;
    }
    stream(stream) {
        this.packet_length = stream.streamWord(this.packet_length);
        this.packet_id = stream.streamWord(this.packet_id);
        this.packet_type = stream.streamByte(this.packet_type);
    }
}
exports.FmbMessage = FmbMessage;
//# sourceMappingURL=FmbMessage.js.map