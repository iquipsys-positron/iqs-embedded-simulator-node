import { Message } from '../protocol/Message';
import { ISimulatorConnector } from './ISimulatorConnector';
export declare class NullSimulatorConnector implements ISimulatorConnector {
    sendMessage(udi: string, message: Message): void;
    addMessageListener(udi: string, listener: (message: Message) => void): void;
    removeMessageListener(udi: string): void;
}
