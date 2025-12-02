import { Dial } from "../dial.js";

export async function solve(input: string[]): Promise<number> {
    let dial = new Dial();
    let result = 0;

    input.map(rotation => {
        let rot: {direction: string, clicks: number} = {direction: rotation.charAt(0), clicks: parseInt(rotation.substring(1))};
        return rot;
    }).forEach((x) => {
        result += dial.countOfTouchingZero(x.direction, x.clicks);
        dial.rotate(x.direction, x.clicks);
    });

    return result;
}