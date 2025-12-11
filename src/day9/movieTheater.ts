import {Rectangle, Tile, TileColor} from "../util.js";

export class MovieTheater {
    private redTiles: Tile[] = [];
    private rectangles: Rectangle[] = [];
    private coloredTilesMapByX: Map<number, Set<number>> = new Map();
    private coloredTilesMapByY: Map<number, Set<number>> = new Map();

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

    getRedTiles(): Tile[] {
        return this.redTiles;
    }

    getRectangles(): Rectangle[] {
        return this.rectangles;
    }

    findRectangles(): Rectangle[] {
        for(let i = 0; i < this.redTiles.length; i++) {
            for (let j = i + 1; j < this.redTiles.length; j++) {
                this.rectangles.push(this.createRectangle(this.redTiles[i], this.redTiles[j]));
            }
        }
        this.rectangles = this.rectangles.sort((a, b) => b.size - a.size);
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

    markTileWithGreen(x: number, y: number): void {
        let isRedTile = this.redTiles.some(t => t.x === x && t.y === y);
        if(!isRedTile) {
            if(this.coloredTilesMapByX.get(x)) {
                this.coloredTilesMapByX.get(x)?.add(y);
            } else {
                this.coloredTilesMapByX.set(x, new Set([y]));
            }
            if(this.coloredTilesMapByY.get(y)) {
                this.coloredTilesMapByY.get(y)?.add(x);
            } else {
                this.coloredTilesMapByY.set(y, new Set([x]));
            }
        }
    }

    markEdgesWithGreenColor(): void {
        this.redTiles.forEach(tile => {
            let redTilesInColumn = this.redTiles.filter(t => t.x === tile.x).sort((a, b) => a.y - b.y);
            if(!redTilesInColumn) { return; }
            for(let i = redTilesInColumn[0].y; i < redTilesInColumn[redTilesInColumn.length-1].y; i += 1) {
                this.markTileWithGreen(tile.x, i);
            }

            let redTilesInLine = this.redTiles.filter(t => t.y === tile.y).sort((a, b) => a.x - b.x);
            if(!redTilesInLine) { return; }
            for(let i = redTilesInLine[0].x; i < redTilesInLine[redTilesInLine.length-1].x; i += 1) {
                this.markTileWithGreen(i, tile.y);
            }
        })
    }

    doesRectangleHaveOnlyGreenEdges(rectangle: Rectangle): boolean {
        let isFullGreen = true;
        let smallerX: number, smallerY: number, biggerX: number, biggerY: number;

        if(rectangle.corner1.x >= rectangle.corner2.x) {
            smallerX = rectangle.corner2.x;
            biggerX = rectangle.corner1.x;
        } else {
            smallerX = rectangle.corner1.x;
            biggerX = rectangle.corner2.x;
        }
        if(rectangle.corner1.y >= rectangle.corner2.y) {
            smallerY = rectangle.corner2.y;
            biggerY = rectangle.corner1.y;
        } else {
            smallerY = rectangle.corner1.y;
            biggerY = rectangle.corner2.y;
        }

        for (let i = smallerX + 1; i < biggerX; i++) {
            let borderPointsUnderThisOne = Array.from(this.coloredTilesMapByX.get(i) ?? []).filter(y => y > smallerY).length;
            isFullGreen = isFullGreen && (borderPointsUnderThisOne === 0 ||  borderPointsUnderThisOne% 2 === 1);

            let borderPointsOverThisOne = Array.from(this.coloredTilesMapByX.get(i) ?? []).filter(y => y < biggerY).length;
            isFullGreen = isFullGreen && (borderPointsOverThisOne === 0 || borderPointsOverThisOne % 2 === 1);
            if(!isFullGreen) {
                return isFullGreen;
            }
        }

        for (let i = smallerY + 1; i < biggerY; i++) {
            let borderPointsToTheRight = Array.from(this.coloredTilesMapByY.get(i) ?? []).filter(x => x > smallerX).length;
            isFullGreen = isFullGreen && (borderPointsToTheRight === 0 || borderPointsToTheRight % 2 === 1);

            let borderPointsToTheLeft = Array.from(this.coloredTilesMapByY.get(i) ?? []).filter(x => x < biggerX).length;
            isFullGreen = isFullGreen && (borderPointsToTheLeft === 0 || borderPointsToTheLeft % 2 === 1);
            if(!isFullGreen) {
                return isFullGreen;
            }
        }

        return isFullGreen
    }

}