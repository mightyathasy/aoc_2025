import { TachyonManifold } from "./tachyonManifold.js";

export async function solve(input: string[]): Promise<number> {

    let tachyonManifold = new TachyonManifold();
    tachyonManifold.setData(input);
    tachyonManifold.sendBeamIn();

    // Part 1
    // return tachyonManifold.getSplitCount();

    // Part 2
    return tachyonManifold.getAlternativePathCount();
}