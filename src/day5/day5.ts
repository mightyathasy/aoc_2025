import { InventoryManager } from "./inventoryManager.js";

export async function solve(input: string[]): Promise<number> {

    let inventoryManager = new InventoryManager();
    inventoryManager.setData(input);

    // Part 1
    // return inventoryManager.getFreshIDsCount();

    // Part 2
    return inventoryManager.getAllFreshIDs();
}