import { HomeworkSolver } from "./homeworkSolver.js";

export async function solve(input: string[]): Promise<number> {

    let homeworkSolver = new HomeworkSolver();
    homeworkSolver.setData(input);

    return homeworkSolver.solve();

}