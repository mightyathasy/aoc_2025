import { TachyonManifold } from "./tachyonManifold.js";

export async function solve(input: string[]): Promise<number> {

    let tachyonManifold = new TachyonManifold();
    tachyonManifold.setData(input);
    tachyonManifold.sendBeamIn();

    return tachyonManifold.getSplitCount();

}