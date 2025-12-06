export class HomeworkSolver {
    private data: string [][] = [];
    private operators: string[] = [];
    private separatorSpaces: number[] = [];

    constructor() { }

    setData(input: string[]): void {
        input.forEach(line => {
            if(this.separatorSpaces.length === 0) {
                this.separatorSpaces = line.split('').map((c, i) => { if (c === ' ') { return i } else { return -1 } }).filter(i => i !== -1);
            } else {
                let separators: number[] = [];
                this.separatorSpaces.forEach(i => {
                    if (line.charAt(i) === ' ') { separators.push(i) }
                })
                this.separatorSpaces = separators;
            }
        })
        input.forEach(line => {
            let currentLine: string[] = [];
            this.separatorSpaces.forEach((separatorIndex, i) => {
                if(i === 0) {
                    currentLine.push(line.slice(0, separatorIndex));
                } else {
                    currentLine.push(line.slice(this.separatorSpaces[i-1], separatorIndex));
                }
            })
            if(isNaN(parseInt(currentLine[0]))) {
                this.operators = currentLine.map(s => s.trim());
                return;
            }
            this.data.push(currentLine);
        })
    }

    getLineLength(): number {
        if(this.data.length === 0) return 0;
        return this.data[0].length;
    }

    useOperator(valueA: number, valueB: number, operator: string): number {
        switch(operator) {
            case '+':
                return valueA + valueB;
            case '*':
                return valueA * valueB;
            default:
                throw new Error(`Unknown operator: ${operator}`);
        }
    }

    solvePart1(): number {
        let result = 0;

        for (let i = 0; i < this.getLineLength(); i++) {
            let column = this.data.map(line => line[i]);
            let columnResult = parseInt(column[0]);
            column.forEach((n, j) => {
                if(j === 0) return;
                columnResult = this.useOperator(columnResult, parseInt(n), this.operators[i]);
            })
            result += columnResult;
        }

        return result;
    }

    solvePart2(): number {
        let result = 0;

        // TODO

        return result;
    }

}