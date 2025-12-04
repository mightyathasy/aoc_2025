import { Bank } from "./bank.js";

export async function solve(input: string[]): Promise<number> {
    let addedJoltage = 0;

    input.forEach((batteries) => {
        let bank = new Bank();
        bank.setBatteries(batteries);
        addedJoltage += bank.getJoltage();
        console.log(`Batteries: ${batteries}, Joltage: ${bank.getJoltage()}`);
    });

    return addedJoltage;
}