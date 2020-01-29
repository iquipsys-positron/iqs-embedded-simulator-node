"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("./Message");
class ErrorMessage extends Message_1.Message {
    constructor() {
        super(11);
    }
    stream(stream) {
        super.stream(stream);
        this.code = stream.streamWord(this.code);
        this.message = stream.streamString(this.message);
    }
}
exports.ErrorMessage = ErrorMessage;
//# sourceMappingURL=ErrorMessage.js.map