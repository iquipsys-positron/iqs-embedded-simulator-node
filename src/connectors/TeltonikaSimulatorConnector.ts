let _ = require('lodash');

import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { IOpenable } from 'pip-services3-commons-node';
import { CompositeLogger } from 'pip-services3-components-node';
import { ConnectionResolver } from 'pip-services3-components-node';

import { WriteStream } from 'iqs-libs-protocols-node';

import { Message } from '../protocol/Message';
import { IncomingMessageDecoder } from '../protocol/IncomingMessageDecoder';
import { ISimulatorConnector } from './ISimulatorConnector';
// import { StateUpdateMessage } from '../protocol/StateUpdateMessage';
import { StateUpdateMessage2 } from '../protocol/StateUpdateMessage2';

import { PacketType } from '../protocol/PacketType';
import { AvlData } from '../protocol/AvlData';
import { AvlDataPriority } from '../protocol/AvlDataPriority';
import { IoElement } from '../protocol/IoElement';
import { AvlDataFmbMessage } from '../protocol/AvlDataFmbMessage';
import { FmbMessage } from '../protocol/FmbMessage';

export class TeltonikaSimulatorConnector
    implements ISimulatorConnector, IConfigurable, IReferenceable, IOpenable {

    private _connectionResolver: ConnectionResolver = new ConnectionResolver();
    private _logger: CompositeLogger = new CompositeLogger();
    private _client: any;
    private _host: string;
    private _port: number;
    private _listeners: any = {};
    private _packetId = 0;

    public configure(config: ConfigParams): void {
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

            this._host = options.getHost();
            this._port = options.getPort();

            let dgram = require('dgram');
            this._client = dgram.createSocket('udp4');

            this._logger.trace(correlationId, "Connected to Teltonika server");

            // Todo: Temporary hack!!
            callback(null);
        });
    }

    public close(correlationId: string, callback: (err: any) => void): void {
        if (this._client != null) {
            this._client = null;
            this._logger.trace(correlationId, "Disconnected from Teltonika server");
        }

        callback(null);
    }

    private deviceUdiToClientId(udi: string) {
        return udi.replace(/[^0-9a-fA-F]/g, '').toLowerCase();
    }

    public sendMessage(udi: string, message: Message): void {
        if (this._client) {
            let fmbMessage: FmbMessage;

            if (message instanceof StateUpdateMessage2)
                fmbMessage = this.stateUpdateToFmbMessage(message);
            else return;

            // Serialize outgoing message
            let stream = new WriteStream();
            fmbMessage.stream(stream);
            let buffer = stream.toBuffer();

            this._client.send(buffer, 0, buffer.length, this._port, this._host, (err) => {
                if (err) this._logger.error(null, err, "Failed to send to Teltonika server");
            });
        }
    }

    private stateUpdateToFmbMessage(message: StateUpdateMessage2): AvlDataFmbMessage {
        let result = new AvlDataFmbMessage();
        result.packet_id = this._packetId++;
        result.packet_type = PacketType.AcknowledgementRequired;
        result.avl_packet_id = 1;
        result.device_udi = message.device_udi;
        result.avl_data = [];

        let data = new AvlData();
        data.time = message.time;
        data.priority = AvlDataPriority.Low;
        data.lng = message.lng;
        data.lat = message.lat;
        data.alt = message.alt;
        data.angle = message.angle;
        data.speed = message.speed;
        data.satellites = 12;
        data.event_id = 0;
        data.io_elements = [];

        let data1 = _.clone(data);
        let freezedParams = message.params.filter(param => {
            return param.id === 2
        });
        data1.io_elements.push(<IoElement>{
            id: 240,
            value: freezedParams[0].val ? 0 : 1,
            size: 1
        });
        result.avl_data.push(data1);

        let powerParams = message.params.filter(param => {
            return param.id === 1
        });
        if (powerParams[0].val != null) {
            data1.io_elements.push(<IoElement>{
                id: 239,
                value: 1,
                size: 1
            });
            result.avl_data.push(data1);
        }

        let pressedEvents = message.events.filter(event => {
            return event.id === 1
        });
        if (pressedEvents[0].val) {
            let data2 = _.clone(data);
            data2.event_id = 1;
            data2.io_elements.push(<IoElement>{
                id: 1,
                value: 1,
                size: 1
            });
            result.avl_data.push(data2);
        }

        let longPressedEvents = message.events.filter(event => {
            return event.id === 2
        });
        if (longPressedEvents[0].val) {
            let data3 = _.clone(data);
            data3.event_id = 9;
            data3.io_elements.push(<IoElement>{
                id: 9,
                value: 10000,
                size: 2
            });
            result.avl_data.push(data3);
        }

        return result;
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