"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const NullSimulatorConnector_1 = require("../connectors/NullSimulatorConnector");
const LoraSimulatorConnector_1 = require("../connectors/LoraSimulatorConnector");
const PhoneSimulatorConnector_1 = require("../connectors/PhoneSimulatorConnector");
const TeltonikaSimulatorConnector_1 = require("../connectors/TeltonikaSimulatorConnector");
const SimulatorDevice_1 = require("../devices/SimulatorDevice");
const ImmobileDevice_1 = require("../devices/ImmobileDevice");
const MovingDevice_1 = require("../devices/MovingDevice");
const PressingDevice_1 = require("../devices/PressingDevice");
const TwoPointsDevice_1 = require("../devices/TwoPointsDevice");
const IndoorDevice_1 = require("../devices/IndoorDevice");
const PathMovingDevice_1 = require("../devices/PathMovingDevice");
const FreezingDevice_1 = require("../devices/FreezingDevice");
const TeltonikaSimDevice_1 = require("../devices/TeltonikaSimDevice");
class SimulatorFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(SimulatorFactory.NullConnectorDescriptor, NullSimulatorConnector_1.NullSimulatorConnector);
        this.registerAsType(SimulatorFactory.LoraConnectorDescriptor, LoraSimulatorConnector_1.LoraSimulatorConnector);
        this.registerAsType(SimulatorFactory.PhoneConnectorDescriptor, PhoneSimulatorConnector_1.PhoneSimulatorConnector);
        this.registerAsType(SimulatorFactory.TeltonikaConnectorDescriptor, TeltonikaSimulatorConnector_1.TeltonikaSimulatorConnector);
        this.registerAsType(SimulatorFactory.DeviceDescriptor, SimulatorDevice_1.SimulatorDevice);
        this.registerAsType(SimulatorFactory.ImmobileDeviceDescriptor, ImmobileDevice_1.ImmobileDevice);
        this.registerAsType(SimulatorFactory.MovingDeviceDescriptor, MovingDevice_1.MovingDevice);
        this.registerAsType(SimulatorFactory.PressingDeviceDescriptor, PressingDevice_1.PressingDevice);
        this.registerAsType(SimulatorFactory.PressingDeviceDescriptor, PressingDevice_1.PressingDevice);
        this.registerAsType(SimulatorFactory.TwoPointsDeviceDescriptor, TwoPointsDevice_1.TwoPointsDevice);
        this.registerAsType(SimulatorFactory.IndoorDeviceDescriptor, IndoorDevice_1.IndoorDevice);
        this.registerAsType(SimulatorFactory.PathMovingDeviceDescriptor, PathMovingDevice_1.PathMovingDevice);
        this.registerAsType(SimulatorFactory.FreezingDeviceDescriptor, FreezingDevice_1.FreezingDevice);
        this.registerAsType(SimulatorFactory.TeltonikaSimDeviceDescriptor, TeltonikaSimDevice_1.TeltonikaSimDevice);
    }
}
exports.SimulatorFactory = SimulatorFactory;
SimulatorFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("iqs-embedded-simulator-node", "factory", "default", "default", "1.0");
SimulatorFactory.NullConnectorDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-embedded-simulator-node", "connector", "null", "*", "1.0");
SimulatorFactory.LoraConnectorDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-embedded-simulator-node", "connector", "lora", "*", "1.0");
SimulatorFactory.PhoneConnectorDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-embedded-simulator-node", "connector", "phone", "*", "1.0");
SimulatorFactory.TeltonikaConnectorDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-embedded-simulator-node", "connector", "teltonika", "*", "1.0");
SimulatorFactory.DeviceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-embedded-simulator-node", "device", "default", "*", "1.0");
SimulatorFactory.ImmobileDeviceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-embedded-simulator-node", "device", "immobile", "*", "1.0");
SimulatorFactory.MovingDeviceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-embedded-simulator-node", "device", "moving", "*", "1.0");
SimulatorFactory.PressingDeviceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-embedded-simulator-node", "device", "pressing", "*", "1.0");
SimulatorFactory.TwoPointsDeviceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-embedded-simulator-node", "device", "two-points", "*", "1.0");
SimulatorFactory.IndoorDeviceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-embedded-simulator-node", "device", "indoor", "*", "1.0");
SimulatorFactory.PathMovingDeviceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-embedded-simulator-node", "device", "path", "*", "1.0");
SimulatorFactory.FreezingDeviceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-embedded-simulator-node", "device", "freeze", "*", "1.0");
SimulatorFactory.TeltonikaSimDeviceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-embedded-simulator-node", "device", "teltonika-sim", "*", "1.0");
//# sourceMappingURL=SimulatorFactory.js.map