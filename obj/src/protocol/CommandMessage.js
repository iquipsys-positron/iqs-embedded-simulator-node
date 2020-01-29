"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("./Message");
class CommandMessage extends Message_1.Message {
    constructor() {
        super(12);
    }
    stream(stream) {
        super.stream(stream);
        this.timestamp = stream.streamDWord(this.timestamp);
        this.commands = this.streamDataValues(stream, this.commands);
    }
}
exports.CommandMessage = CommandMessage;
//# sourceMappingURL=CommandMessage.js.map