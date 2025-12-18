import { Machine } from "./machine.js";

export class Factory {
    private machines: Machine[] = [];

    constructor() { }

    setData(input: string[]): void {
        this.machines = input.map(line => new Machine(line));
    }

    getMachines(): Machine[]{
        return this.machines;
    }

    calculateFewestButtonPushesForMachines(): void {
        this.machines.forEach(machine => {
            machine.calculateFastestConfiguringSequence();
        })
    }

}