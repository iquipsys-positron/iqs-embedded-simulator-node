"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_container_node_1 = require("pip-services3-container-node");
const SimulatorFactory_1 = require("../build/SimulatorFactory");
class SimulatorProcess extends pip_services3_container_node_1.ProcessContainer {
    constructor() {
        super("mtcdt-simulator", "MultiTech Conduit simulator");
        this._factories.add(new SimulatorFactory_1.SimulatorFactory());
    }
}
exports.SimulatorProcess = SimulatorProcess;
//# sourceMappingURL=SimulatorProcess.js.map