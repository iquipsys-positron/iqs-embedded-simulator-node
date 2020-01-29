"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("./Message");
class DeviceInitMessage extends Message_1.Message {
    constructor() {
        super(1);
    }
    stream(stream) {
        super.stream(stream);
        this.device_version = stream.streamByte(this.device_version);
        this.data_version = stream.streamByte(this.data_version);
    }
}
exports.DeviceInitMessage = DeviceInitMessage;
//# sourceMappingURL=DeviceInitMessage.js.map