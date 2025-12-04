export class PrintingRoom {
    private paperRolls: string[][] = [];
    private accessibleRolls: boolean[][] = [];
    private removedRollsCount: number = 0;

    constructor() {}

    setPaperRolls(rolls: string[]): void {
        rolls.forEach(r => {
            let rollCharacters = r.split('');
            this.paperRolls.push(rollCharacters);
            this.accessibleRolls.push(rollCharacters.map(_ => false));
        })
    }

    getAccessibleRollsCount(): number {
        let accessibleCount = 0;
        this.accessibleRolls.forEach(rollLine => {
            rollLine.forEach(roll => {
                if(roll) accessibleCount++;
            })
        })
        return accessibleCount;
    }

    getRemovedRollsCount(): number {
        return this.removedRollsCount;
    }

    markRollsAccessible(): void{
        this.paperRolls.forEach((rollLine, i) => {
            rollLine.forEach((roll, j) => {
                if(roll === '@' && this.countAdjacentRolls(i, j) < 4) {
                    this.accessibleRolls[i][j] = true;
                }
            })
        })
    }

    countAdjacentRolls(i: number, j: number): number {
        let adjacentCount = 0;
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],                [0, 1],
            [1, -1],   [1, 0],   [1, 1]
        ];
        directions.forEach((direction) => {
            this.paperRolls[i + direction[0]]?.[j + direction[1]] === '@' ? adjacentCount++ : null;
        })
        return adjacentCount;
    }

    removeAccessibleRolls(): void {
        this.paperRolls.forEach((rollLine, i) => {
            rollLine.forEach((roll, j) => {
                if(this.accessibleRolls[i][j]) {
                    this.paperRolls[i][j] = 'x';
                    this.accessibleRolls[i][j] = false;
                    this.removedRollsCount++;
                }
            })
        })
    }

}