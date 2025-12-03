import { Bank } from "../bank.js";

export async function solve(input: string[]): Promise<number> {
    let addedJoltage = 0;

    input.forEach((batteries) => {
        let bank = new Bank();
        bank.setBatteries(batteries);
        console.log(`Batteries: ${batteries}`);
        addedJoltage += bank.getJoltagePart1();
        // addedJoltage += bank.getJoltagePart2();
    });

    return addedJoltage;
}