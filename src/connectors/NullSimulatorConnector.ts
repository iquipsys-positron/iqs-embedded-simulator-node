import { Message } from '../protocol/Message';
import { ISimulatorConnector } from './ISimulatorConnector';

export class NullSimulatorConnector implements ISimulatorConnector {

    public sendMessage(udi: string, message: Message): void {
        // Do nothing
    }

    public addMessageListener(udi: string, listener: (message: Message) => void) {
        // Do nothing
    }

    public removeMessageListener(udi: string) {
        // Do nothing
    }
}