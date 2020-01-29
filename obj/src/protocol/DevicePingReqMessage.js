"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("./Message");
class DevicePingReqMessage extends Message_1.Message {
    constructor() {
        super(8);
    }
    stream(stream) {
        super.stream(stream);
        this.timestamp = stream.streamDWord(this.timestamp);
    }
}
exports.DevicePingReqMessage = DevicePingReqMessage;
//# sourceMappingURL=DevicePingReqMessage.js.map