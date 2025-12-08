export class TachyonManifold {
    private diagram: string[][] = [];
    private pathCountDiagram: number[][] = [];
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

        this.calculateAlternativePathsForCells();
    }

    getSplitCount(): number {
        return this.numberOfSplits;
    }

    getAlternativePathCount(): number {
        return this.pathCountDiagram[this.pathCountDiagram.length - 1].reduce((sum, val) => sum + (val > 0 ? val : 0), 0);
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

    private calculateAlternativePathsForCells(): void {
        this.pathCountDiagram = this.diagram.map(line => line.map(cell => cell === '|' ? 0 : -1));
        this.diagram.forEach((line, index) => {
            let lineAbove = this.diagram[index - 1];
            if(!lineAbove) return;
            line.forEach((cell, i) => {
                if(cell !== '|') return;

                if(lineAbove[i] === 'S') { this.pathCountDiagram[index][i] = 1; }

                // Check if reached by splitter from the left
                if(line[i - 1] && line[i - 1] === '^'  && this.pathCountDiagram[index - 1][i - 1] !== -1) {
                    this.pathCountDiagram[index][i] += this.pathCountDiagram[index-1][i -1];
                    if(this.pathCountDiagram[index-1][i -1] === -1) {
                        throw new Error('Unexpected -1 value when calculating alternative paths');
                    }
                }

                // Check if reached straight from above
                if(lineAbove[i] === '|'  && this.pathCountDiagram[index - 1][i] !== -1) {
                    this.pathCountDiagram[index][i] += this.pathCountDiagram[index - 1][i];
                    if(this.pathCountDiagram[index-1][i] === -1) {
                        throw new Error('Unexpected -1 value when calculating alternative paths');
                    }
                }

                // Check if reached by splitter from the right
                if(line[i + 1] && line[i + 1] === '^' && this.pathCountDiagram[index - 1][i + 1] !== -1) {
                    this.pathCountDiagram[index][i] += this.pathCountDiagram[index - 1][i + 1];
                    if(this.pathCountDiagram[index-1][i +1] === -1) {
                        throw new Error('Unexpected -1 value when calculating alternative paths');
                    }
                }
            })
        })
    }

}