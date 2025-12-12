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

    // isTileColored(tile: Tile): boolean {
    //     // TODO: ezt meg kene irni es vegignezni a keretet, hogy szines-e. ha valamelyik nem szines, akkor csak arra megvizshalni, hogy a polygon resze-e
    //     return false;
    // }

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

        if(smallerX === biggerX || smallerY === biggerY) {
            // if the width of the rectangle is 1, then it's all colored.
            return true;
        }

        // A rectangle is full colored, if it's borders are all colored.
        // If a point in the border of the rectangle is not colored yet, then we are checking if it's part of the polygon by 'rays':
        // When we look inside the rectangle from the border point and we see that there is odd number of colored point in front of us, then we are inside the polygon.
        for (let i = smallerX + 1; i < biggerX; i++) {
            if(this.coloredTilesMapByX.get(i)?.has(smallerY) || this.redTiles.some(t => t.x === i && t.y === smallerY)) {
                continue;
            }
            let borderPointsUnderThisOne = Array.from(this.coloredTilesMapByX.get(i) ?? []).filter(y => y > smallerY).length;
            if(borderPointsUnderThisOne % 2 !== 1) {
                return false;
            }
        }

        for (let i = smallerX + 1; i < biggerX; i++) {
            if(this.coloredTilesMapByX.get(i)?.has(biggerY) || this.redTiles.some(t => t.x === i && t.y === biggerY)) {
                continue;
            }
            let borderPointsOverThisOne = Array.from(this.coloredTilesMapByX.get(i) ?? []).filter(y => y < biggerY).length;
            if(borderPointsOverThisOne % 2 !== 1) {
                return false;
            }
        }

        for (let i = smallerY + 1; i < biggerY; i++) {
            if(this.coloredTilesMapByY.get(i)?.has(smallerX) || this.redTiles.some(t => t.y === i && t.x === smallerX)) {
                continue;
            }
            let borderPointsToTheRight = Array.from(this.coloredTilesMapByY.get(i) ?? []).filter(x => x > smallerX).length;
            if(borderPointsToTheRight % 2 !== 1) {
                return false;
            }
        }

        for (let i = smallerY + 1; i < biggerY; i++) {
            if(this.coloredTilesMapByY.get(i)?.has(biggerX) || this.redTiles.some(t => t.y === i && t.x === biggerX)) {
                continue;
            }
            let borderPointsToTheLeft = Array.from(this.coloredTilesMapByY.get(i) ?? []).filter(x => x < biggerX).length;
            if(borderPointsToTheLeft % 2 !== 1) {
                return false;
            }
        }

        // TODO: Az fingatja meg, hogy amikor egy pontbol mondjuk lefele elnezunk es ez a sugar atmegy egy elen, akkor tudja fene mi lesz a count

        return true;
    }
}