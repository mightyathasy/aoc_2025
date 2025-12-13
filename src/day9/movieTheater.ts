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

    putTileInColoredCluster(x: number, y: number): void {
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
            this.putTileInColoredCluster(tile.x, tile.y);

            let redTilesInColumn = this.redTiles.filter(t => t.x === tile.x).sort((a, b) => a.y - b.y);
            if(!redTilesInColumn) { return; }
            for(let i = redTilesInColumn[0].y; i < redTilesInColumn[redTilesInColumn.length-1].y; i += 1) {
                this.putTileInColoredCluster(tile.x, i);
            }

            let redTilesInLine = this.redTiles.filter(t => t.y === tile.y).sort((a, b) => a.x - b.x);
            if(!redTilesInLine) { return; }
            for(let i = redTilesInLine[0].x; i < redTilesInLine[redTilesInLine.length-1].x; i += 1) {
                this.putTileInColoredCluster(i, tile.y);
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
            let yCoordinatesInColumn = this.coloredTilesMapByX.get(i);
            if(!yCoordinatesInColumn) {
                return false;
            }

            // If a red of the rectangle is in this column, then we are good.
            if(this.redTiles.some(t => t.x === i && (t.y === smallerY || t.y === biggerY))) {
                continue;
            }

            let borderPointsUnderThisOne = 0;
            let borderPointsOverThisOne = 0;
            for(const yCoordinate of yCoordinatesInColumn.entries()) {
                if(yCoordinate[0] > smallerY && !yCoordinatesInColumn.has(yCoordinate[0] - 1)) {
                    borderPointsUnderThisOne++;
                }
                if(yCoordinate[0] < biggerY && !yCoordinatesInColumn.has(yCoordinate[0] + 1)) {
                    borderPointsOverThisOne++;
                }
            }
            if(borderPointsUnderThisOne % 2 !== 1 || borderPointsOverThisOne % 2 !== 1) {
                return false;
            }
        }

        for (let i = smallerY + 1; i < biggerY; i++) {
            let xCoordinatesInLine = this.coloredTilesMapByY.get(i);
            if(!xCoordinatesInLine) {
                return false;
            }

            // If a red of the rectangle is in this line, then we are good.
            if(this.redTiles.some(t => t.y === i && (t.x === smallerX || t.x === biggerX))) {
                continue;
            }

            let borderPointsToTheRight = 0;
            let borderPointsToTheLeft = 0;
            for(const xCoordinate of xCoordinatesInLine.entries()) {
                if(xCoordinate[0] > smallerY && !xCoordinatesInLine.has(xCoordinate[0] + 1)) {
                    borderPointsToTheRight++;
                }
                if(xCoordinate[0] < biggerY && !xCoordinatesInLine.has(xCoordinate[0] - 1)) {
                    borderPointsToTheLeft++;
                }
            }
            if(borderPointsToTheRight % 2 !== 1 || borderPointsToTheLeft % 2 !== 1) {
                return false;
            }
        }

        return true;
    }
}