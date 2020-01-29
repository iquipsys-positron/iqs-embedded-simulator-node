/**
 * Devices with this type moves by coordinates setted in config path property
 * When they reach last point they going backwards
 */
import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { IOpenable } from 'pip-services3-commons-node';
export declare class PathMovingDevice implements IConfigurable, IReferenceable, IOpenable {
    private _orgId;
    private _udi;
    private _activeInterval;
    private _inactiveInterval;
    private _offorganizationInterval;
    private _organizationVersion;
    private _allBeacons;
    private _latitude;
    private _lngtitude;
    private _altitude;
    private _speed;
    private _angle;
    private _lastSent;
    private _deltaLatitude;
    private _deltaLongitude;
    private _steps;
    private _beacons;
    private _freezed;
    private _pressed;
    private _longPressed;
    private _power;
    private _logger;
    private _connector;
    private _intervalId;
    private _path;
    private _movingForward;
    private _positionIndex;
    constructor();
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    isOpen(): boolean;
    open(correlationId: string, callback: (err: any) => void): void;
    close(correlationId: string, callback: (err: any) => void): void;
    private receiveMessage;
    private updateStatus;
    private simulateState;
    private toUdi;
    private sendDeviceInitMessage;
    private sendStatusUpdateMessage;
    private processOrganizationInfoMessage;
    private processDevicePingReqMessage;
    private processSignalMessage;
}
