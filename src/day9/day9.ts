import { MovieTheater } from "./movieTheater.js";

export async function solve(input: string[]): Promise<number> {
    let movieTheater = new MovieTheater();
    movieTheater.setData(input);

    // Part 1
    return movieTheater.findRectangles().sort((a, b) => b.size - a.size )[0].size;
}