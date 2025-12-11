import {Tile, TileColor, Rectangle} from "../util.js";

export class MovieTheater {
    private redTiles: Tile[] = [];
    private rectangles: Rectangle[] = [];

    constructor() { }

    setData(input: string[]): void {
        this.redTiles = input.map(line => {
            return {
                x: parseInt(line.split(',')[0].trim()),
                y: parseInt(line.split(',')[1].trim()),
                color: TileColor.Red
            }
        }).sort((a, b) => { return a.x - b.x || a.y - b.y ; });
    }

    getRectangles(): Rectangle[]{
        return this.rectangles;
    }

    findRectangles(): Rectangle[]{
        for(let i = 0; i < this.redTiles.length; i++) {
            for (let j = i + 1; j < this.redTiles.length; j++) {
                this.rectangles.push(this.createRectangle(this.redTiles[i], this.redTiles[j]));
            }
        }
        return this.rectangles
    }

    createRectangle(tile1: Tile, tile2: Tile): Rectangle {
        let rectangle: Rectangle = {corner1: tile1, corner2: tile2, size: 0}
        rectangle.size = this.calculateRectangleSize(rectangle);
        return rectangle;
    }

    calculateRectangleSize(rectangle: Rectangle): number {
        return (Math.abs(rectangle.corner2.x - rectangle.corner1.x) +1) * (Math.abs(rectangle.corner2.y - rectangle.corner1.y) +1);
    }

}