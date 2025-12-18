export type IDRange = { min: number; max: number };
export type JunctionBox = { x: number, y: number, z: number, connectionIDs: number[], circuitID: number };
export type Tile = { x: number, y: number, color: TileColor };
export type Rectangle = { corner1: Tile, corner2: Tile, size: number }

export enum TileColor {
    Red = '#',
    Green = 'X',
    NoColor = '.'
}

export function* getNLongPermutationsOfNumbers(n: number, numbers: number[]): Generator<number[]> {
    function* backtrack(current: number[]): Generator<number[]> {
        if (current.length === n) { yield [...current]; return; }
        for (const value of numbers) {
            current.push(value);
            yield* backtrack(current);
            current.pop();
        }
    }
    yield* backtrack([]);
}

export function* getNLongCombinationsOfNumbers(n: number, numbers: number[]): Generator<number[]> {
    function* backtrack(startIndex: number, current: number[]): Generator<number[]> {
        if (current.length === n) {  yield [...current]; return; }
        for (let i = startIndex; i < numbers.length; i++) {
            current.push(numbers[i]);
            yield* backtrack(i, current);
            current.pop();
        }
    }
    yield* backtrack(0, []);
}