import type { IDRange } from "../util.js";
type normalizableIDRange = IDRange & {normalized: boolean};

export class InventoryManager {
    private idRanges: normalizableIDRange[] = [];
    private ids: number[] = [];

    constructor() { }

    setData(input: string[]): void {
        for (let line of input) {
            if (line === "") {
                continue;
            }
            let parts = line.split("-");

            if (parts.length === 1) {
                this.ids.push(Number(parts[0]));
            }
            if (parts.length === 2) {
                this.idRanges.push({min: Number(parts[0]), max: Number(parts[1]), normalized: false});
            }
        }
        this.idRanges = this.idRanges.sort((a, b) => a.min - b.min);
    }

    getIsAllNormalized(): boolean {
        return !this.idRanges.find(r => !r.normalized);
    }

    getFreshIDsCount(): number {
        let freshIDsCount = 0;
        this.ids.forEach((id) => {
            freshIDsCount += this.idRanges.find((r) => r.min <= id && r.max >= id) ? 1 : 0;
        })
        return freshIDsCount;
    }

    getAllFreshIDs(): number {
        let freshIDs: number = 0;
        let normalizedIDRanges: IDRange[] = [];

        while(!this.getIsAllNormalized()) {
            let currentIDRangeToCombineIn: IDRange | null = null;
            this.idRanges.forEach((range) => {
                if(!currentIDRangeToCombineIn && !range.normalized) {
                    range.normalized
                    currentIDRangeToCombineIn = range;
                    normalizedIDRanges.push(currentIDRangeToCombineIn);
                    return;
                }

                if(!currentIDRangeToCombineIn) { return; }

                // currentIDRangeToCombineIn:       |-------------------|
                // range:                                                                   |-------------------------|
                if(currentIDRangeToCombineIn.min <= range.min && currentIDRangeToCombineIn.min <= range.max
                    && currentIDRangeToCombineIn.max >= range.min && currentIDRangeToCombineIn.max <= range.max) {
                    currentIDRangeToCombineIn.max = range.max;
                    return;
                }
                // currentIDRangeToCombineIn:                                 |----------------------------|
                // range:                                                               |---------------------|
                if(currentIDRangeToCombineIn.min >= range.min && currentIDRangeToCombineIn.min <= range.max
                    && currentIDRangeToCombineIn.max >= range.max) {
                    currentIDRangeToCombineIn.min = range.min;
                    return;
                }
                //  currentIDRangeToCombineIn:                          |----|
                //  range:                                                     |-------------------------|
                if(currentIDRangeToCombineIn.min >= range.min && currentIDRangeToCombineIn.min <= range.max
                    && currentIDRangeToCombineIn.max <= range.max) {
                    currentIDRangeToCombineIn.min = range.min;
                    currentIDRangeToCombineIn.max = range.max;
                    return;
                }

                //   currentIDRangeToCombineIn:       |---------------------|
                //  range:                                                              |-----|
                // In this case we do nothing.
            })
            this.idRanges.forEach((range) => {
                if(currentIDRangeToCombineIn && range.min >= currentIDRangeToCombineIn.min && range.max <= currentIDRangeToCombineIn.max) {
                    range.normalized = true;
                }
            })
        }

        normalizedIDRanges.forEach(range => {
            console.log(`Range: ${range.min} - ${range.max} => ${ (range.max - range.min) + 1 }`);
            freshIDs += (range.max - range.min) + 1;
        })
        return freshIDs;
    }

}