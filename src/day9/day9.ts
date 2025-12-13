import { MovieTheater } from "./movieTheater.js";

export async function solve(input: string[]): Promise<number> {
    let movieTheater = new MovieTheater();
    movieTheater.setData(input);
    movieTheater.findRectangles();
    movieTheater.markEdgesWithGreenColor();
    // Part 1
    // return movieTheater.getRectangles()[0].size;

    console.log(`Number of rectangles: ${movieTheater.getRectangles().length}`)

    let i = 0;
    let biggestColoredRectangle;

    for(const [index, rectangle] of movieTheater.getRectangles().entries()) {
        i = index;
        if(movieTheater.doesRectangleHaveOnlyGreenEdges(rectangle)) {
            biggestColoredRectangle = rectangle;
            break;
        }
    }

    console.log(`Index of the rectangle: ${i}`);
    return biggestColoredRectangle?.size ?? 0;

    // last answer that did not work:
    // 1160674
    // 1183891
    // 1805722
    // 1857573
    // 167640200
}