import { Factory } from "./factory.js";

export async function solve(input: string[]): Promise<number> {
    let factory = new Factory();
    factory.setData(input);
    factory.calculateFewestButtonPushesForMachines();

    // Part 1
    let buttonPusherForAllMachines = 0;
    factory.getMachines().forEach((machine) => { buttonPusherForAllMachines += machine.getFastestConfiguringSequence() });
    return buttonPusherForAllMachines;
}