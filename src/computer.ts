type IDRange = { min: number; max: number };

export class Computer {
    private idRanges: IDRange[] | undefined;
    constructor() {}

    setIDRanges(ids: string[]): void {
        this.idRanges = ids.map(id => {
            let idRange: IDRange = { min: Number(id.split('-')[0]), max: Number(id.split('-')[1])};
            return idRange;
        }).sort((a: IDRange, b: IDRange) => {
            return a.min - b.min;
        });
    }

    getIDRanges(): IDRange[] {
        if(!this.idRanges) {
            throw new Error("ID Ranges not set");
        }
        return this.idRanges;
    }

    isIDInvalid(id: number): boolean {
        let idAsString = id.toString();
        return idAsString.slice(0, (idAsString.length / 2)) === idAsString.slice((idAsString.length / 2), idAsString.length);
    }

    getInvalidIDsInRange(range: IDRange): number[] {
        let invalidIDs: number[] = [];
        for(let id = range.min; id <= range.max; id++) {
            if(this.isIDInvalid(id)) {
                invalidIDs.push(id);
            }
        }
        return invalidIDs;
    }

}