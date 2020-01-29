import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { NullSimulatorConnector } from '../connectors/NullSimulatorConnector';
import { LoraSimulatorConnector } from '../connectors/LoraSimulatorConnector';
import { PhoneSimulatorConnector } from '../connectors/PhoneSimulatorConnector';
import { TeltonikaSimulatorConnector } from '../connectors/TeltonikaSimulatorConnector';
import { SimulatorDevice } from '../devices/SimulatorDevice';
import { ImmobileDevice } from '../devices/ImmobileDevice';
import { MovingDevice } from '../devices/MovingDevice';
import { PressingDevice} from '../devices/PressingDevice';
import { TwoPointsDevice} from '../devices/TwoPointsDevice';
import { IndoorDevice } from '../devices/IndoorDevice';
import { PathMovingDevice } from '../devices/PathMovingDevice'
import { FreezingDevice } from '../devices/FreezingDevice'
import { TeltonikaSimDevice} from '../devices/TeltonikaSimDevice'

export class SimulatorFactory extends Factory {
	public static Descriptor = new Descriptor("iqs-embedded-simulator-node", "factory", "default", "default", "1.0");
	public static NullConnectorDescriptor = new Descriptor("iqs-embedded-simulator-node", "connector", "null", "*", "1.0");
	public static LoraConnectorDescriptor = new Descriptor("iqs-embedded-simulator-node", "connector", "lora", "*", "1.0");
	public static PhoneConnectorDescriptor = new Descriptor("iqs-embedded-simulator-node", "connector", "phone", "*", "1.0");
	public static TeltonikaConnectorDescriptor = new Descriptor("iqs-embedded-simulator-node", "connector", "teltonika", "*", "1.0");
	public static DeviceDescriptor = new Descriptor("iqs-embedded-simulator-node", "device", "default", "*", "1.0");
	public static ImmobileDeviceDescriptor = new Descriptor("iqs-embedded-simulator-node", "device", "immobile", "*", "1.0");
	public static MovingDeviceDescriptor = new Descriptor("iqs-embedded-simulator-node", "device", "moving", "*", "1.0");
	public static PressingDeviceDescriptor = new Descriptor("iqs-embedded-simulator-node", "device", "pressing", "*", "1.0");
	public static TwoPointsDeviceDescriptor = new Descriptor("iqs-embedded-simulator-node", "device", "two-points", "*", "1.0");
	public static IndoorDeviceDescriptor = new Descriptor("iqs-embedded-simulator-node", "device", "indoor", "*", "1.0");
	public static PathMovingDeviceDescriptor = new Descriptor("iqs-embedded-simulator-node", "device", "path", "*", "1.0");
	public static FreezingDeviceDescriptor = new Descriptor("iqs-embedded-simulator-node", "device", "freeze", "*", "1.0");
	public static TeltonikaSimDeviceDescriptor = new Descriptor("iqs-embedded-simulator-node", "device", "teltonika-sim", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(SimulatorFactory.NullConnectorDescriptor, NullSimulatorConnector);
		this.registerAsType(SimulatorFactory.LoraConnectorDescriptor, LoraSimulatorConnector);
		this.registerAsType(SimulatorFactory.PhoneConnectorDescriptor, PhoneSimulatorConnector);
		this.registerAsType(SimulatorFactory.TeltonikaConnectorDescriptor, TeltonikaSimulatorConnector);
		this.registerAsType(SimulatorFactory.DeviceDescriptor, SimulatorDevice);
		this.registerAsType(SimulatorFactory.ImmobileDeviceDescriptor, ImmobileDevice);
		this.registerAsType(SimulatorFactory.MovingDeviceDescriptor, MovingDevice);
		this.registerAsType(SimulatorFactory.PressingDeviceDescriptor, PressingDevice);
		this.registerAsType(SimulatorFactory.PressingDeviceDescriptor, PressingDevice);
		this.registerAsType(SimulatorFactory.TwoPointsDeviceDescriptor, TwoPointsDevice);
		this.registerAsType(SimulatorFactory.IndoorDeviceDescriptor, IndoorDevice);
		this.registerAsType(SimulatorFactory.PathMovingDeviceDescriptor, PathMovingDevice);
		this.registerAsType(SimulatorFactory.FreezingDeviceDescriptor, FreezingDevice);
		this.registerAsType(SimulatorFactory.TeltonikaSimDeviceDescriptor, TeltonikaSimDevice);
	}
}