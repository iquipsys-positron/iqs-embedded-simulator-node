"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("./Message");
class SignalMessage extends Message_1.Message {
    constructor() {
        super(4);
    }
    stream(stream) {
        super.stream(stream);
        this.signal = stream.streamByte(this.signal);
        this.timestamp = stream.streamDWord(this.timestamp);
    }
}
exports.SignalMessage = SignalMessage;
//# sourceMappingURL=SignalMessage.js.map