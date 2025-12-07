export class TachyonManifold {
    private diagram: string[][] = [];
    private numberOfSplits: number = 0;

    constructor() { }

    setData(input: string[]): void {
        this.diagram = input.map(line => line.split(''));
    }

    sendBeamIn(): void {
        let currentActiveLine = 1;
        let startingPointIndex = this.diagram[0].indexOf('S');
        this.diagram[currentActiveLine][startingPointIndex] = '|';

        while(this.moveBeam(currentActiveLine)) {
            // Beam could move downward, so continue
            currentActiveLine++;
        }
    }

    getSplitCount(): number {
        return this.numberOfSplits;
    }

    private splitBeam(lineOfSplitter: number, positionOfSplitter: number): void {
        if(this.diagram[lineOfSplitter][positionOfSplitter - 1]) {
            this.diagram[lineOfSplitter][positionOfSplitter - 1] = '|';
        }
        if(this.diagram[lineOfSplitter][positionOfSplitter + 1]) {
            this.diagram[lineOfSplitter][positionOfSplitter + 1] = '|';
        }
        this.numberOfSplits++;
    }

    private moveBeam(lineToMoveIn: number): boolean {
        // Check if the beam can move down
        if(!this.diagram[lineToMoveIn + 1]) return false;

        this.diagram[lineToMoveIn].forEach((cell, index) => {
            if(cell !== '|') return;
            if(this.diagram[lineToMoveIn + 1][index] === '.') {
                this.diagram[lineToMoveIn + 1][index] = '|';
            }
            if(this.diagram[lineToMoveIn + 1][index] === '^') {
                this.splitBeam(lineToMoveIn + 1, index);
            }
        })

        return true;
    }

}