"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OrganizationInfoMessage_1 = require("./OrganizationInfoMessage");
const DevicePingReqMessage_1 = require("./DevicePingReqMessage");
const SignalMessage_1 = require("./SignalMessage");
const CommandMessage_1 = require("./CommandMessage");
const iqs_libs_protocols_node_1 = require("iqs-libs-protocols-node");
class IncomingMessageDecoder {
    static decode(buffer, protocolVersion) {
        let messageType = buffer && buffer.length > 0 ? buffer.readUInt8(0) : -1;
        let message = null;
        switch (messageType) {
            case 2:
                message = new OrganizationInfoMessage_1.OrganizationInfoMessage();
                break;
            case 4:
                message = new SignalMessage_1.SignalMessage();
                break;
            case 8:
                message = new DevicePingReqMessage_1.DevicePingReqMessage();
                break;
            case 12:
                message = new CommandMessage_1.CommandMessage();
                break;
        }
        if (message != null) {
            message.protocol_version = protocolVersion;
            let stream = new iqs_libs_protocols_node_1.ReadStream(buffer);
            try {
                // Deserialize the message
                message.stream(stream);
            }
            catch (_a) {
                // If streaming fails then discard the message
                message = null;
            }
        }
        return message;
    }
}
exports.IncomingMessageDecoder = IncomingMessageDecoder;
//# sourceMappingURL=IncomingMessageDecoder.js.map