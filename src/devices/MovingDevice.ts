/**
 * Just randomly moving from setted position
 */

import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { IOpenable } from 'pip-services3-commons-node';
import { CompositeLogger } from 'pip-services3-components-node';

import { RandomInteger } from 'pip-services3-commons-node';
import { RandomFloat } from 'pip-services3-commons-node';
import { RandomBoolean } from 'pip-services3-commons-node';

import { ISimulatorConnector } from '../connectors/ISimulatorConnector';
import { IncomingMessageDecoder } from '../protocol/IncomingMessageDecoder';
import { Message } from '../protocol/Message';
import { DeviceInitMessage } from '../protocol/DeviceInitMessage';
import { OrganizationInfoMessage } from '../protocol/OrganizationInfoMessage';
import { DevicePingReqMessage } from '../protocol/DevicePingReqMessage';
import { SignalMessage } from '../protocol/SignalMessage';
import { DevicePingMessage } from '../protocol/DevicePingMessage';
import { StateUpdateMessage } from '../protocol/StateUpdateMessage';
import { StateUpdateMessage2 } from '../protocol/StateUpdateMessage2';
import { stat } from 'fs';
import { RandomArray } from 'pip-services3-commons-node/obj/src/random/RandomArray';
import { DataValue } from '../protocol/DataValue';

export class MovingDevice implements IConfigurable, IReferenceable, IOpenable {
    private _orgId: string = null;
    private _udi: string = '0000000000000001';
    private _activeInterval: number = 5; // sec
    private _inactiveInterval: number = 30; // sec
    private _offorganizationInterval: number = 900; // sec
    private _organizationVersion: number = 0;
    private _allBeacons: string[] = null;

    private _latitude: number = 0;
    private _lngtitude: number = 0;
    private _altitude: number = 0;
    private _speed: number = 0;
    private _angle: number = 0;
    private _lastSent: number = 0;
    private _deltaLatitude: number = 0;
    private _deltaLongitude: number = 0;
    private _steps: number = 0;
    private _beacons: string[] = null;
    private _freezed: boolean = false;
    private _pressed: boolean = false;
    private _longPressed: boolean = false;
    private _power: boolean = true;

    private _logger: CompositeLogger = new CompositeLogger();
    private _connector: ISimulatorConnector;
    private _intervalId: any = null;

    public constructor() {}

    public configure(config: ConfigParams): void {
        this._orgId = config.getAsStringWithDefault('org_id', this._orgId);
        this._udi = config.getAsStringWithDefault('udi', this._udi);
        this._activeInterval = config.getAsIntegerWithDefault('active_interval', this._activeInterval);
        this._inactiveInterval = config.getAsIntegerWithDefault('inactive_interval', this._inactiveInterval);
        this._offorganizationInterval = config.getAsIntegerWithDefault('offsite_interval', this._offorganizationInterval);
        this._latitude = config.getAsFloatWithDefault('latitude', this._latitude);
        this._lngtitude = config.getAsFloatWithDefault('longitude', this._lngtitude);

        let beacons = config.getAsNullableString('beacons');
        if (beacons)
            this._allBeacons = beacons.split(',');

        this._logger.configure(config);
    }

    public setReferences(references: IReferences) {
        this._connector = references.getOneRequired<ISimulatorConnector>(
            new Descriptor("iqs-embedded-simulator-node", "connector", "*", "*", "1.0")
        );
        this._logger.setReferences(references);
    }

    public isOpen(): boolean {
        return this._intervalId != null;
    }

    public open(correlationId: string, callback: (err: any) => void) {
        if (this._intervalId) {
            clearInterval(this._intervalId);
            this._intervalId = null;
        }

        this._intervalId = setInterval(
            () => { this.updateStatus() }, 1000);

        this._connector.addMessageListener(
            this._udi, (message: Message) => { this.receiveMessage(message); });

        this._logger.info(this._udi, 'Started simulation for device %s', this._udi);

        this.sendDeviceInitMessage();

        callback(null);
    }

    public close(correlationId: string, callback: (err: any) => void) {
        if (this._intervalId) {
            clearInterval(this._intervalId);
            this._intervalId = null;
        }

        this._connector.removeMessageListener(this._udi);

        callback(null);
    }

    private receiveMessage(message: Message) {
        if (message instanceof OrganizationInfoMessage) {
            this.processOrganizationInfoMessage(message);
        }
        else if (message instanceof DevicePingReqMessage) {
            this.processDevicePingReqMessage(message);
        }
        else if (message instanceof SignalMessage) {
            this.processSignalMessage(message);
        }
    }

    private updateStatus(): void {
        let now = new Date().getTime();
        let elapsedTime = (now - this._lastSent) / 1000;

        this.simulateState()

        if (!this._freezed && elapsedTime >= this._activeInterval) {
            this.sendStatusUpdateMessage();
            this._lastSent = now;
        }
        else if (this._freezed && elapsedTime >= this._inactiveInterval) {
            this.sendStatusUpdateMessage();
            this._lastSent = now;
        }
    }

    private simulateState() {
        let hasCoordinates = this._latitude != null && this._lngtitude != null;
        if (hasCoordinates) {
            if (this._speed <= 0) {
                this._deltaLatitude = RandomFloat.nextFloat(-0.00001, 0.00001);
                this._deltaLongitude = RandomFloat.nextFloat(-0.00001, 0.00001);
                this._steps = RandomInteger.nextInteger(1, 15);
            }

            this._steps--;
            this._latitude += this._deltaLatitude;
            this._lngtitude += this._deltaLongitude;
            this._speed = RandomInteger.nextInteger(0, 40);
            this._altitude = RandomInteger.nextInteger(0, 1000);
            this._angle = RandomInteger.nextInteger(0, 360);
        }

        let hasBeacons = this._allBeacons != null && this._allBeacons.length > 0;
        if (hasBeacons) {
            this._beacons = [RandomArray.pick(this._allBeacons)];
        }

        this._power = RandomBoolean.chance(9, 10);
    }

    private toUdi(udi: string) {
        return udi.replace(/[^\+0-9a-fA-F]/g, '').toLowerCase();
    }
    
    private sendDeviceInitMessage(): void {
        let deviceInitMessage = new DeviceInitMessage();
        deviceInitMessage.org_id = this._orgId;
        deviceInitMessage.device_udi = this.toUdi(this._udi);
        deviceInitMessage.device_version = 1;
        deviceInitMessage.data_version = this._organizationVersion;

        this._connector.sendMessage(this._udi, deviceInitMessage);

        this._logger.info(this._udi, "Sent device init");
    }

    private sendStatusUpdateMessage(): void {
        let statusMessage = new StateUpdateMessage2();
        statusMessage.org_id = this._orgId;
        statusMessage.device_udi = this.toUdi(this._udi);
        statusMessage.data_version = this._organizationVersion;
        statusMessage.lat = this._latitude;
        statusMessage.lng = this._lngtitude;
        statusMessage.alt = this._altitude;
        statusMessage.speed = this._speed;
        statusMessage.angle = this._angle;
        statusMessage.beacons = this._beacons;
        // statusMessage.quality = 0;
        // statusMessage.freezed = this._freezed;
        // statusMessage.pressed = this._pressed;
        // statusMessage.long_pressed = this._longPressed;
        // statusMessage.power = this._power;
        statusMessage.params = new Array<DataValue>();
        statusMessage.events = new Array<DataValue>()
        statusMessage.params.push(new DataValue(1, +this._power));
        statusMessage.params.push(new DataValue(2, +this._freezed));
        statusMessage.events.push(new DataValue(1, +this._pressed));
        statusMessage.events.push(new DataValue(2, +this._longPressed));

        this._connector.sendMessage(this._udi, statusMessage);

        this._logger.info(this._udi, "Send status update %d : %d : %d : %d : %d",
            this._latitude, this._lngtitude, this._freezed, this._pressed, this._longPressed);
    }

    private processOrganizationInfoMessage(message: OrganizationInfoMessage): void {
        this._logger.info(this._udi, "Received organization info");

        this._organizationVersion = message.data_version;
        this._activeInterval = message.active_int;
        this._inactiveInterval = message.active_int;
        this._offorganizationInterval = message.offsite_int;

        this._latitude = this._latitude ? this._latitude : message.center_lat;
        this._lngtitude = this._lngtitude ? this._lngtitude : message.center_lng;
    }
    
    private processDevicePingReqMessage(message: DevicePingReqMessage): void {
        let response = new DevicePingMessage();
        response.org_id = this._orgId;
        response.device_udi = this.toUdi(this._udi);

        this._connector.sendMessage(this._udi, response);

        this._logger.info(this._udi, "Responded on device ping");
    }

    private processSignalMessage(message: SignalMessage): void {
        this._logger.info(this._udi, "Received signal %d", message.signal);
    }
    
}