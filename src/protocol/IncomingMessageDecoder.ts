import { BadRequestException } from 'pip-services3-commons-node';

import { Message } from './Message';
import { OrganizationInfoMessage } from './OrganizationInfoMessage';
import { DevicePingReqMessage } from './DevicePingReqMessage';
import { SignalMessage } from './SignalMessage';
import { CommandMessage } from './CommandMessage';
import { ReadStream } from 'iqs-libs-protocols-node';

export class IncomingMessageDecoder {

    public static decode(buffer: Buffer, protocolVersion: number): Message {
        
        let messageType = buffer && buffer.length > 0 ? buffer.readUInt8(0) : -1;
        let message: Message = null;

        switch (messageType) {
            case 2:
                message = new OrganizationInfoMessage();
                break;
            case 4:
                message = new SignalMessage();
                break;
            case 8:
                message = new DevicePingReqMessage();
                break;
            case 12:
                message = new CommandMessage();
                break;
        }

        if (message != null) {
            message.protocol_version = protocolVersion;
            let stream = new ReadStream(buffer);
            try {
                // Deserialize the message
                message.stream(stream);
            } catch {
                // If streaming fails then discard the message
                message = null;
            }
        }

        return message;
    }
    
}