let SimulatorProcess = require('../obj/src/container/SimulatorProcess').SimulatorProcess;

try {
    new SimulatorProcess().run(process.argv);
} catch (ex) {
    console.error(ex);
}
