import { Playground } from "./playground.js";

export async function solve(input: string[]): Promise<number> {

    let playground = new Playground();
    playground.setData(input);
    playground.createCircuits();

    // Part 1
    // let circuits = playground.getCircuits().entries();
    // let result = 1;
    //
    // @ts-ignore
    // let circuitID = circuits.next().value[0];
    // let countOfBoxes = playground.getBoxesOfCircuit(circuitID).length;
    // result *= countOfBoxes;
    // return result;

    // Part 2
    return playground.getResultForPart2();
}