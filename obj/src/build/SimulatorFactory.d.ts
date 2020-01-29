import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';
export declare class SimulatorFactory extends Factory {
    static Descriptor: Descriptor;
    static NullConnectorDescriptor: Descriptor;
    static LoraConnectorDescriptor: Descriptor;
    static PhoneConnectorDescriptor: Descriptor;
    static TeltonikaConnectorDescriptor: Descriptor;
    static DeviceDescriptor: Descriptor;
    static ImmobileDeviceDescriptor: Descriptor;
    static MovingDeviceDescriptor: Descriptor;
    static PressingDeviceDescriptor: Descriptor;
    static TwoPointsDeviceDescriptor: Descriptor;
    static IndoorDeviceDescriptor: Descriptor;
    static PathMovingDeviceDescriptor: Descriptor;
    static FreezingDeviceDescriptor: Descriptor;
    static TeltonikaSimDeviceDescriptor: Descriptor;
    constructor();
}
