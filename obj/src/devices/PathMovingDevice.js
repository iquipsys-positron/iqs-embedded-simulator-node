"use strict";
/**
 * Devices with this type moves by coordinates setted in config path property
 * When they reach last point they going backwards
 */
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const DeviceInitMessage_1 = require("../protocol/DeviceInitMessage");
const OrganizationInfoMessage_1 = require("../protocol/OrganizationInfoMessage");
const DevicePingReqMessage_1 = require("../protocol/DevicePingReqMessage");
const SignalMessage_1 = require("../protocol/SignalMessage");
const DevicePingMessage_1 = require("../protocol/DevicePingMessage");
const StateUpdateMessage2_1 = require("../protocol/StateUpdateMessage2");
const RandomArray_1 = require("pip-services3-commons-node/obj/src/random/RandomArray");
const DataValue_1 = require("../protocol/DataValue");
class PathMovingDevice {
    constructor() {
        this._orgId = null;
        this._udi = '0000000000000001';
        this._activeInterval = 5; // sec
        this._inactiveInterval = 30; // sec
        this._offorganizationInterval = 900; // sec
        this._organizationVersion = 0;
        this._allBeacons = null;
        this._latitude = 0;
        this._lngtitude = 0;
        this._altitude = 0;
        this._speed = 0;
        this._angle = 0;
        this._lastSent = 0;
        this._deltaLatitude = 0;
        this._deltaLongitude = 0;
        this._steps = 0;
        this._beacons = null;
        this._freezed = false;
        this._pressed = false;
        this._longPressed = false;
        this._power = true;
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        this._intervalId = null;
        this._path = null;
        this._movingForward = true;
        this._positionIndex = 0;
    }
    configure(config) {
        this._orgId = config.getAsStringWithDefault('org_id', this._orgId);
        this._udi = config.getAsStringWithDefault('udi', this._udi);
        this._activeInterval = config.getAsIntegerWithDefault('active_interval', this._activeInterval);
        this._inactiveInterval = config.getAsIntegerWithDefault('inactive_interval', this._inactiveInterval);
        this._offorganizationInterval = config.getAsIntegerWithDefault('offsite_interval', this._offorganizationInterval);
        let strPath = config.getAsString('path').split(';');
        this._path = new Array(strPath.length);
        for (let i = 0; i < strPath.length; i++) {
            this._path[i] = new Array(2);
            this._path[i][0] = strPath[i].split(',')[0];
            this._path[i][1] = strPath[i].split(',')[1];
        }
        let beacons = config.getAsNullableString('beacons');
        if (beacons)
            this._allBeacons = beacons.split(',');
        this._logger.configure(config);
    }
    setReferences(references) {
        this._connector = references.getOneRequired(new pip_services3_commons_node_1.Descriptor("iqs-embedded-simulator-node", "connector", "*", "*", "1.0"));
        this._logger.setReferences(references);
    }
    isOpen() {
        return this._intervalId != null;
    }
    open(correlationId, callback) {
        if (this._intervalId) {
            clearInterval(this._intervalId);
            this._intervalId = null;
        }
        this._intervalId = setInterval(() => { this.updateStatus(); }, 1000);
        this._connector.addMessageListener(this._udi, (message) => { this.receiveMessage(message); });
        this._logger.info(this._udi, 'Started simulation for device %s', this._udi);
        this.sendDeviceInitMessage();
        callback(null);
    }
    close(correlationId, callback) {
        if (this._intervalId) {
            clearInterval(this._intervalId);
            this._intervalId = null;
        }
        this._connector.removeMessageListener(this._udi);
        callback(null);
    }
    receiveMessage(message) {
        if (message instanceof OrganizationInfoMessage_1.OrganizationInfoMessage) {
            this.processOrganizationInfoMessage(message);
        }
        else if (message instanceof DevicePingReqMessage_1.DevicePingReqMessage) {
            this.processDevicePingReqMessage(message);
        }
        else if (message instanceof SignalMessage_1.SignalMessage) {
            this.processSignalMessage(message);
        }
    }
    updateStatus() {
        let now = new Date().getTime();
        let elapsedTime = (now - this._lastSent) / 1000;
        if (!this._freezed && elapsedTime >= this._activeInterval) {
            this.simulateState();
            this.sendStatusUpdateMessage();
            this._lastSent = now;
        }
        else if (this._freezed && elapsedTime >= this._inactiveInterval) {
            this.sendStatusUpdateMessage();
            this._lastSent = now;
        }
    }
    simulateState() {
        if (this._movingForward) {
            if (this._positionIndex < this._path.length - 1) {
                this._lngtitude = parseFloat(this._path[this._positionIndex][0]);
                this._latitude = parseFloat(this._path[this._positionIndex][1]);
                this._positionIndex++;
            }
            else {
                this._movingForward = false;
                this._lngtitude = parseFloat(this._path[this._positionIndex][0]);
                this._latitude = parseFloat(this._path[this._positionIndex][1]);
                this._positionIndex--;
            }
        }
        else {
            if (this._positionIndex > 0) {
                this._lngtitude = parseFloat(this._path[this._positionIndex][0]);
                this._latitude = parseFloat(this._path[this._positionIndex][1]);
                this._positionIndex--;
            }
            else {
                this._movingForward = true;
                this._lngtitude = parseFloat(this._path[this._positionIndex][0]);
                this._latitude = parseFloat(this._path[this._positionIndex][1]);
                this._positionIndex++;
            }
        }
        this._speed = pip_services3_commons_node_2.RandomInteger.nextInteger(0, 40);
        this._altitude = pip_services3_commons_node_2.RandomInteger.nextInteger(0, 1000);
        this._angle = pip_services3_commons_node_2.RandomInteger.nextInteger(0, 360);
        let hasBeacons = this._allBeacons != null && this._allBeacons.length > 0;
        if (hasBeacons) {
            this._beacons = [RandomArray_1.RandomArray.pick(this._allBeacons)];
        }
        this._power = pip_services3_commons_node_3.RandomBoolean.chance(9, 10);
    }
    toUdi(udi) {
        return udi.replace(/[^\+0-9a-fA-F]/g, '').toLowerCase();
    }
    sendDeviceInitMessage() {
        let deviceInitMessage = new DeviceInitMessage_1.DeviceInitMessage();
        deviceInitMessage.org_id = this._orgId;
        deviceInitMessage.device_udi = this.toUdi(this._udi);
        deviceInitMessage.device_version = 1;
        deviceInitMessage.data_version = this._organizationVersion;
        this._connector.sendMessage(this._udi, deviceInitMessage);
        this._logger.info(this._udi, "Sent device init");
    }
    sendStatusUpdateMessage() {
        let statusMessage = new StateUpdateMessage2_1.StateUpdateMessage2();
        statusMessage.org_id = this._orgId;
        statusMessage.device_udi = this.toUdi(this._udi);
        statusMessage.data_version = this._organizationVersion;
        statusMessage.lat = this._latitude;
        statusMessage.lng = this._lngtitude;
        statusMessage.alt = this._altitude;
        statusMessage.speed = this._speed;
        statusMessage.angle = this._angle;
        // statusMessage.quality = 0;
        // statusMessage.freezed = this._freezed;
        // statusMessage.pressed = this._pressed;
        // statusMessage.long_pressed = this._longPressed;
        // statusMessage.power = this._power;
        statusMessage.params = new Array();
        statusMessage.events = new Array();
        statusMessage.params.push(new DataValue_1.DataValue(1, +this._power));
        statusMessage.params.push(new DataValue_1.DataValue(2, +this._freezed));
        statusMessage.events.push(new DataValue_1.DataValue(1, +this._pressed));
        statusMessage.events.push(new DataValue_1.DataValue(2, +this._longPressed));
        this._connector.sendMessage(this._udi, statusMessage);
        this._logger.info(this._udi, "Send status update %d : %d : %d : %d : %d", this._latitude, this._lngtitude, this._freezed, this._pressed, this._longPressed);
    }
    processOrganizationInfoMessage(message) {
        this._logger.info(this._udi, "Received organization info");
        this._organizationVersion = message.data_version;
        this._activeInterval = message.active_int;
        this._inactiveInterval = message.active_int;
        this._offorganizationInterval = message.offsite_int;
        this._latitude = this._latitude ? this._latitude : message.center_lat;
        this._lngtitude = this._lngtitude ? this._lngtitude : message.center_lng;
    }
    processDevicePingReqMessage(message) {
        let response = new DevicePingMessage_1.DevicePingMessage();
        response.org_id = this._orgId;
        response.device_udi = this.toUdi(this._udi);
        this._connector.sendMessage(this._udi, response);
        this._logger.info(this._udi, "Responded on device ping");
    }
    processSignalMessage(message) {
        this._logger.info(this._udi, "Received signal %d", message.signal);
    }
}
exports.PathMovingDevice = PathMovingDevice;
//# sourceMappingURL=PathMovingDevice.js.map