import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { IOpenable } from 'pip-services3-commons-node';
import { Message } from '../protocol/Message';
import { ISimulatorConnector } from './ISimulatorConnector';
export declare class PhoneSimulatorConnector implements ISimulatorConnector, IConfigurable, IReferenceable, IOpenable {
    private _connectionResolver;
    private _logger;
    private _client;
    private _upTopic;
    private _downTopic;
    private _listeners;
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    isOpen(): boolean;
    open(correlationId: string, callback: (err: any) => void): void;
    close(correlationId: string, callback: (err: any) => void): void;
    private deviceUdiToClientId;
    sendMessage(udi: string, message: Message): void;
    addMessageListener(udi: string, listener: (message: Message) => void): void;
    removeMessageListener(udi: string): void;
}
