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
                x: parseInt(line.split(',')[1].trim()),
                y: parseInt(line.split(',')[0].trim()),
                color: TileColor.Red
            }
        });
    }

    getRedTiles(): Tile[] {
        return this.redTiles;
    }

    getRectangles(): Rectangle[] {
        return this.rectangles;
    }

    mapToString(): string {
        let map: string[][] = [];
        let maxX = Math.max(...this.coloredTilesMapByX.keys());
        let maxY = Math.max(...this.coloredTilesMapByY.keys());
        for(let x = 0; x <= maxX; x++) {
            if(!map[x]) {
                map[x] = [];
            }
            for(let y = 0; y <= maxY; y++) {
                if(!map[y]) {
                    map[y] = [];
                }
                if(this.redTiles.find(tile => tile.x === x && tile.y === y)) {
                    map[x][y] = '#';
                    continue;
                }
                if(this.coloredTilesMapByX.get(x)?.has(y)) {
                    map[x][y] = 'X';
                    continue;
                }
                map[x][y] = '.';
            }
        }
        return map.map(line => line.join('')).join('\n');
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

    connectEdgeBetweenTiles(tile1: Tile, tile2: Tile) {
        if(tile1.x === tile2.x) {
            let maxY = tile1.y > tile2.y ? tile1.y : tile2.y;
            let minY = tile1.y > tile2.y ? tile2.y : tile1.y;
            for(let y = minY + 1; y < maxY; y++) {
                this.putTileInColoredCluster(tile1.x, y);
            }
        }
        if(tile1.y === tile2.y) {
            let maxX = tile1.x > tile2.x ? tile1.x : tile2.x;
            let minX = tile1.x > tile2.x ? tile2.x : tile1.x;
            for(let x = minX + 1; x < maxX; x++) {
                this.putTileInColoredCluster(x, tile1.y);
            }
        }
    }

    markEdgesWithGreenColor(): void {
        this.redTiles.forEach((tile, index) => {
            this.putTileInColoredCluster(tile.x, tile.y);
            if(this.redTiles[index + 1]) {
                this.connectEdgeBetweenTiles(tile, this.redTiles[index + 1]);
            }
            if(index === this.redTiles.length - 1) {
                this.connectEdgeBetweenTiles(tile, this.redTiles[0]);
            }
        })
    }

    isTileInsideThePolygon(tile: Tile): boolean {
        let intersectionCount = 0;
        for (let i = 0, j = this.redTiles.length - 1; i < this.redTiles.length; j = i++) {
            // As 2 red tiles in the list are adjacent tiles and create an edge, we are using them
            const corner1 = this.redTiles[i];
            const corner2 = this.redTiles[j];

            // Cast a ray downwards and check if it intersects the edge
            const intersects = ((corner1.y > tile.y) !== (corner2.y > tile.y))  // if tile is horizontally between the corners      |       x       |
                                          && (tile.x < (corner2.x - corner1.x) * (tile.y - corner1.y) / (corner2.y - corner1.y) + corner1.x); // if the tile is above the point where the 'ray' would intersect the edge  ___:___

            if (intersects) intersectionCount++;
        }
        return intersectionCount % 2 === 1; // if the number of the intersections is odd, the tile is inside
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

        for (let i = smallerX + 1; i < biggerX; i++) {
            // if the current tile is not colored, then check if its part of the huge polygon
            if(!this.coloredTilesMapByY.get(smallerY)?.has(i) && !this.isTileInsideThePolygon(({x: i, y: smallerY} as Tile))) {
                return false;
            }
            if(!this.coloredTilesMapByY.get(biggerY)?.has(i) && !this.isTileInsideThePolygon(({x: i, y: biggerY} as Tile))) {
                return false;
            }
        }

        for (let i = smallerY + 1; i < biggerY; i++) {
            // if the current tile is not colored, then check if its part of the huge polygon
            if(!this.coloredTilesMapByX.get(smallerX)?.has(i) && !this.isTileInsideThePolygon(({x: smallerX, y: i} as Tile))) {
                return false;
            }
            if(!this.coloredTilesMapByX.get(biggerX)?.has(i) && !this.isTileInsideThePolygon(({x: biggerX, y: i} as Tile))) {
                return false;
            }
        }
        return true;
    }
}