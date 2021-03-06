import { Message } from '../protocol/Message';

export interface ISimulatorConnector {
    sendMessage(udi: string, message: Message): void;
    addMessageListener(udi: string, listener: (message: Message) => void);
    removeMessageListener(udi: string);
}