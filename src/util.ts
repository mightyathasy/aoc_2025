export type IDRange = { min: number; max: number };
export type JunctionBox = { x: number, y: number, z: number, connectionIDs: number[], circuitID: number };
export type Tile = { x: number, y: number, color: TileColor };
export type Rectangle = { corner1: Tile, corner2: Tile, size: number }

export enum TileColor {
    Red = '#',
    NoColor = '.'
}