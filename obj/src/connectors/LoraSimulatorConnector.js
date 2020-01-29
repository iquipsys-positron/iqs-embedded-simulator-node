"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_mqtt_node_1 = require("pip-services3-mqtt-node");
const iqs_libs_protocols_node_1 = require("iqs-libs-protocols-node");
const IncomingMessageDecoder_1 = require("../protocol/IncomingMessageDecoder");
class LoraSimulatorConnector {
    constructor() {
        this._connectionResolver = new pip_services3_mqtt_node_1.MqttConnectionResolver();
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        this._upTopic = 'lora/+/up';
        this._downTopic = 'lora/+/down';
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
                // Parse Lora MQTT message
                let mqttMessage = JSON.parse(buffer.toString());
                let payload = Buffer.from(mqttMessage.data, 'base64');
                // Parse device message
                let message = IncomingMessageDecoder_1.IncomingMessageDecoder.decode(payload, 1);
                if (message == null) {
                    this._logger.error(correlationId, null, 'Received bad message');
                    return;
                }
                let euiPos = this._downTopic.indexOf('+');
                let eui = topic.substring(euiPos, topic.length - this._downTopic.length + euiPos + 1);
                let udi = this.deviceEuiToUdi(eui);
                if (this._listeners[udi]) {
                    try {
                        this._listeners[udi](message);
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
    deviceUdiToEui(udi) {
        udi = udi.replace(/[^0-9a-fA-F]/g, '');
        return udi.replace(/(..)/g, '-$1').substring(1).toLowerCase();
    }
    deviceEuiToUdi(eui) {
        return eui.replace(/[^0-9a-fA-F]/g, '').toLowerCase();
    }
    sendMessage(udi, message) {
        if (this._client) {
            // Serialize device message
            message.protocol_version = 1;
            let stream = new iqs_libs_protocols_node_1.WriteStream();
            message.stream(stream);
            let payload = stream.toBuffer();
            // Convert to Lora MQTT message
            let buffer = JSON.stringify({
                data: payload.toString('base64'),
                ask: false,
                port: 1
            });
            let eui = this.deviceUdiToEui(udi);
            let topic = this._upTopic.replace('+', eui);
            this._client.publish(topic, buffer, { qos: 1 }, (err) => {
                if (err)
                    this._logger.error(null, err, "Failed to publish to topic " + topic);
            });
        }
    }
    addMessageListener(udi, listener) {
        udi = this.deviceEuiToUdi(udi);
        this._listeners[udi] = listener;
    }
    removeMessageListener(udi) {
        udi = this.deviceEuiToUdi(udi);
        this._listeners[udi] = null;
    }
}
exports.LoraSimulatorConnector = LoraSimulatorConnector;
//# sourceMappingURL=LoraSimulatorConnector.js.map