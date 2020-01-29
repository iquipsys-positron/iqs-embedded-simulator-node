"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_components_node_2 = require("pip-services3-components-node");
const iqs_libs_protocols_node_1 = require("iqs-libs-protocols-node");
// import { StateUpdateMessage } from '../protocol/StateUpdateMessage';
const StateUpdateMessage2_1 = require("../protocol/StateUpdateMessage2");
const PacketType_1 = require("../protocol/PacketType");
const AvlData_1 = require("../protocol/AvlData");
const AvlDataPriority_1 = require("../protocol/AvlDataPriority");
const AvlDataFmbMessage_1 = require("../protocol/AvlDataFmbMessage");
class TeltonikaSimulatorConnector {
    constructor() {
        this._connectionResolver = new pip_services3_components_node_2.ConnectionResolver();
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        this._listeners = {};
        this._packetId = 0;
    }
    configure(config) {
        this._connectionResolver.configure(config);
        this._logger.configure(config);
    }
    setReferences(references) {
        this._connectionResolver.setReferences(references);
        this._logger.setReferences(references);
    }
    isOpen() {
        return this._client != null;
    }
    open(correlationId, callback) {
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
    close(correlationId, callback) {
        if (this._client != null) {
            this._client = null;
            this._logger.trace(correlationId, "Disconnected from Teltonika server");
        }
        callback(null);
    }
    deviceUdiToClientId(udi) {
        return udi.replace(/[^0-9a-fA-F]/g, '').toLowerCase();
    }
    sendMessage(udi, message) {
        if (this._client) {
            let fmbMessage;
            if (message instanceof StateUpdateMessage2_1.StateUpdateMessage2)
                fmbMessage = this.stateUpdateToFmbMessage(message);
            else
                return;
            // Serialize outgoing message
            let stream = new iqs_libs_protocols_node_1.WriteStream();
            fmbMessage.stream(stream);
            let buffer = stream.toBuffer();
            this._client.send(buffer, 0, buffer.length, this._port, this._host, (err) => {
                if (err)
                    this._logger.error(null, err, "Failed to send to Teltonika server");
            });
        }
    }
    stateUpdateToFmbMessage(message) {
        let result = new AvlDataFmbMessage_1.AvlDataFmbMessage();
        result.packet_id = this._packetId++;
        result.packet_type = PacketType_1.PacketType.AcknowledgementRequired;
        result.avl_packet_id = 1;
        result.device_udi = message.device_udi;
        result.avl_data = [];
        let data = new AvlData_1.AvlData();
        data.time = message.time;
        data.priority = AvlDataPriority_1.AvlDataPriority.Low;
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
            return param.id === 2;
        });
        data1.io_elements.push({
            id: 240,
            value: freezedParams[0].val ? 0 : 1,
            size: 1
        });
        result.avl_data.push(data1);
        let powerParams = message.params.filter(param => {
            return param.id === 1;
        });
        if (powerParams[0].val != null) {
            data1.io_elements.push({
                id: 239,
                value: 1,
                size: 1
            });
            result.avl_data.push(data1);
        }
        let pressedEvents = message.events.filter(event => {
            return event.id === 1;
        });
        if (pressedEvents[0].val) {
            let data2 = _.clone(data);
            data2.event_id = 1;
            data2.io_elements.push({
                id: 1,
                value: 1,
                size: 1
            });
            result.avl_data.push(data2);
        }
        let longPressedEvents = message.events.filter(event => {
            return event.id === 2;
        });
        if (longPressedEvents[0].val) {
            let data3 = _.clone(data);
            data3.event_id = 9;
            data3.io_elements.push({
                id: 9,
                value: 10000,
                size: 2
            });
            result.avl_data.push(data3);
        }
        return result;
    }
    addMessageListener(udi, listener) {
        let clientId = this.deviceUdiToClientId(udi);
        this._listeners[clientId] = listener;
    }
    removeMessageListener(udi) {
        let clientId = this.deviceUdiToClientId(udi);
        this._listeners[clientId] = null;
    }
}
exports.TeltonikaSimulatorConnector = TeltonikaSimulatorConnector;
//# sourceMappingURL=TeltonikaSimulatorConnector.js.map