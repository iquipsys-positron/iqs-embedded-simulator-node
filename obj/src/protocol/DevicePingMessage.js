"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("./Message");
class DevicePingMessage extends Message_1.Message {
    constructor() {
        super(7);
    }
    stream(stream) {
        super.stream(stream);
    }
}
exports.DevicePingMessage = DevicePingMessage;
//# sourceMappingURL=DevicePingMessage.js.map