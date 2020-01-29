let _ = require('lodash');

import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { IOpenable } from 'pip-services3-commons-node';
import { CompositeLogger } from 'pip-services3-components-node';
import { MqttConnectionResolver } from 'pip-services3-mqtt-node';

import { WriteStream } from 'iqs-libs-protocols-node';

import { Message } from '../protocol/Message';
import { IncomingMessageDecoder } from '../protocol/IncomingMessageDecoder';
import { ISimulatorConnector } from './ISimulatorConnector';

export class PhoneSimulatorConnector 
    implements ISimulatorConnector, IConfigurable, IReferenceable, IOpenable {
    
    private _connectionResolver: MqttConnectionResolver = new MqttConnectionResolver();
    private _logger: CompositeLogger = new CompositeLogger();
    private _client: any;
    private _upTopic: string = '+/up';
    private _downTopic: string = '+/down';
    private _listeners: any = {};

    public configure(config: ConfigParams): void {
        this._upTopic = config.getAsStringWithDefault('up_topic', this._upTopic);
        this._downTopic = config.getAsStringWithDefault('down_topic', this._downTopic);
        
        this._connectionResolver.configure(config);
        this._logger.configure(config);
    }

    public setReferences(references: IReferences): void {
        this._connectionResolver.setReferences(references);
        this._logger.setReferences(references);
    }

    public isOpen(): boolean {
        return this._client != null;
    }

    public open(correlationId: string, callback: (err: any) => void): void {
        this._connectionResolver.resolve(correlationId, (err, options) => {
            if (err) {
                callback(err);
                return;
            }

            let mqtt = require('mqtt');
            let client = mqtt.connect(options.uri, options);
            
            client.on('connect', () => {
                this._client = client;

                this._logger.trace(correlationId, "Connected to MQTT broker");

                // Subscribe to the topic
                this._client.subscribe(this._downTopic, (err) => {
                    if (err) this._logger.error(null, err, "Failed to subscribe to topic " + this._upTopic);
                });

                // callback(null);
            });
            
            client.on('error', (err) => {
                this._logger.error(correlationId, err, "Failed to connect to " + options.uri);
                // callback(err);
            });

            client.on('message', (topic, buffer, packet) => {
                // Parse device message
                let message = IncomingMessageDecoder.decode(buffer, 2);
                if (message == null) {
                    this._logger.error(correlationId, null, 'Received bad message');
                    return;
                }

                let pos = this._downTopic.indexOf('+');
                let clientId = topic.substring(pos, topic.length - this._downTopic.length + pos + 1);

                if (this._listeners[clientId]) {
                    try {
                        this._listeners[clientId](message);
                    } catch (ex) {
                        this._logger.error(null, ex, "Failed to process the message");
                    }
                }
            });
            
            // Todo: Temporary hack!!
            callback(null);
        });
    }

    public close(correlationId: string, callback: (err: any) => void): void {
        if (this._client != null) {
            this._client.end(true);
            this._client = null;
            this._logger.trace(correlationId, "Disconnected from MQTT broker");
        }

        callback(null);
    }

    private deviceUdiToClientId(udi: string) {
        return udi.replace(/[^0-9a-fA-F]/g, '').toLowerCase();
    }
    
    public sendMessage(udi: string, message: Message): void {
        if (this._client) {
            // Serialize device message
            message.protocol_version = 2;
            let stream = new WriteStream();
            message.stream(stream);
            let buffer = stream.toBuffer();

            let clientId = this.deviceUdiToClientId(udi);
            let topic = this._upTopic.replace('+', clientId);
            this._client.publish(topic, buffer, { qos: 1 }, (err) => {
                if (err) this._logger.error(null, err, "Failed to publish to topic " + topic);
            });
        }
    }
 
    public addMessageListener(udi: string, listener: (message: Message) => void) {
        let clientId = this.deviceUdiToClientId(udi);
        this._listeners[clientId] = listener;
    }

    public removeMessageListener(udi: string) {
        let clientId = this.deviceUdiToClientId(udi);
        this._listeners[clientId] = null;
    }
}