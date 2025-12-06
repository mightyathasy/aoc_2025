import { HomeworkSolver } from "./homeworkSolver.js";

export async function solve(input: string[]): Promise<number> {

    let homeworkSolver = new HomeworkSolver();
    homeworkSolver.setData(input);

    // Part 1
    return homeworkSolver.solvePart1();

    // Part 2
    // return homeworkSolver.solvePart2();
}