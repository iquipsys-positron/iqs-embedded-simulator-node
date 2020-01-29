import { IReferences } from 'pip-services3-commons-node';
import { ProcessContainer } from 'pip-services3-container-node';

import { SimulatorFactory } from '../build/SimulatorFactory';

export class SimulatorProcess extends ProcessContainer {

    public constructor() {
        super("mtcdt-simulator", "MultiTech Conduit simulator");
        this._factories.add(new SimulatorFactory());
    }


}
