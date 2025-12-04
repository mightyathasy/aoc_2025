import { PrintingRoom } from "./printingRoom.js";

export async function solve(input: string[]): Promise<number> {
    let printingRoom = new PrintingRoom();
    printingRoom.setPaperRolls(input);

    printingRoom.markRollsAccessible();

    // Part 1
    // return printingRoom.getAccessibleRollsCount();

    while(printingRoom.getAccessibleRollsCount() > 0) {
        printingRoom.removeAccessibleRolls();
        printingRoom.markRollsAccessible();
    }

    return printingRoom.getRemovedRollsCount();
}