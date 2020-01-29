"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_mqtt_node_1 = require("pip-services3-mqtt-node");
const iqs_libs_protocols_node_1 = require("iqs-libs-protocols-node");
const IncomingMessageDecoder_1 = require("../protocol/IncomingMessageDecoder");
class PhoneSimulatorConnector {
    constructor() {
        this._connectionResolver = new pip_services3_mqtt_node_1.MqttConnectionResolver();
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        this._upTopic = '+/up';
        this._downTopic = '+/down';
        this._listeners = {};
    }
    configure(config) {
        this._upTopic = config.getAsStringWithDefault('up_topic', this._upTopic);
        this._downTopic = config.getAsStringWithDefault('down_topic', this._downTopic);
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
            let mqtt = require('mqtt');
            let client = mqtt.connect(options.uri, options);
            client.on('connect', () => {
                this._client = client;
                this._logger.trace(correlationId, "Connected to MQTT broker");
                // Subscribe to the topic
                this._client.subscribe(this._downTopic, (err) => {
                    if (err)
                        this._logger.error(null, err, "Failed to subscribe to topic " + this._upTopic);
                });
                // callback(null);
            });
            client.on('error', (err) => {
                this._logger.error(correlationId, err, "Failed to connect to " + options.uri);
                // callback(err);
            });
            client.on('message', (topic, buffer, packet) => {
                // Parse device message
                let message = IncomingMessageDecoder_1.IncomingMessageDecoder.decode(buffer, 2);
                if (message == null) {
                    this._logger.error(correlationId, null, 'Received bad message');
                    return;
                }
                let pos = this._downTopic.indexOf('+');
                let clientId = topic.substring(pos, topic.length - this._downTopic.length + pos + 1);
                if (this._listeners[clientId]) {
                    try {
                        this._listeners[clientId](message);
                    }
                    catch (ex) {
                        this._logger.error(null, ex, "Failed to process the message");
                    }
                }
            });
            // Todo: Temporary hack!!
            callback(null);
        });
    }
    close(correlationId, callback) {
        if (this._client != null) {
            this._client.end(true);
            this._client = null;
            this._logger.trace(correlationId, "Disconnected from MQTT broker");
        }
        callback(null);
    }
    deviceUdiToClientId(udi) {
        return udi.replace(/[^0-9a-fA-F]/g, '').toLowerCase();
    }
    sendMessage(udi, message) {
        if (this._client) {
            // Serialize device message
            message.protocol_version = 2;
            let stream = new iqs_libs_protocols_node_1.WriteStream();
            message.stream(stream);
            let buffer = stream.toBuffer();
            let clientId = this.deviceUdiToClientId(udi);
            let topic = this._upTopic.replace('+', clientId);
            this._client.publish(topic, buffer, { qos: 1 }, (err) => {
                if (err)
                    this._logger.error(null, err, "Failed to publish to topic " + topic);
            });
        }
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
exports.PhoneSimulatorConnector = PhoneSimulatorConnector;
//# sourceMappingURL=PhoneSimulatorConnector.js.map