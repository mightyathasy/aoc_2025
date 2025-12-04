import { Computer } from "./computer.js";

export async function solve(input: string[]): Promise<number> {
    let computer = new Computer();
    computer.setIDRanges(String(input).split(','));

    let invalidIDsAdded = 0;
    computer.getIDRanges().forEach((range) => {
        computer.getInvalidIDsInRange(range).forEach((id) => {
            invalidIDsAdded += id;
        });
    });

    return invalidIDsAdded;
}