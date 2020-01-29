"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FmbMessage_1 = require("./FmbMessage");
const PacketType_1 = require("./PacketType");
class AvlResponseFmbMessage extends FmbMessage_1.FmbMessage {
    constructor() {
        super();
        this.packet_length = 5;
        this.packet_id = 0;
        this.packet_type = PacketType_1.PacketType.NoAcknowledgement;
    }
    stream(stream) {
        super.stream(stream);
        this.avl_packet_id = stream.streamByte(this.avl_packet_id);
        this.avl_elements = stream.streamByte(this.avl_elements);
    }
}
exports.AvlResponseFmbMessage = AvlResponseFmbMessage;
//# sourceMappingURL=AvlResponseFmbMessage.js.map