export class Bank {
    private  batteries: number[] = [];
    constructor() {}

    setBatteries(batteries: string): void {
        this.batteries = batteries.split("").map(b => Number(b));
    }

    getBatteries(): number[] {
        return this.batteries;
    }

    getIndexOfBatteryAfterIndex(capacity: number, index: number = 0): number {
        return this.batteries.slice(index+1).findIndex(b => b === capacity);
    }

    getJoltagePart1(): number {
        let joltage = 0;
        // Iterating from 99 to 11
        for(let capacityFirstLetter = 9; capacityFirstLetter >= 1; capacityFirstLetter--) {
            let firstIndex = this.batteries.findIndex(b => b === capacityFirstLetter);
            if(firstIndex > -1) {
                for(let capacitySecondLetter = 9; capacitySecondLetter >= 1; capacitySecondLetter--) {
                    let secondIndex = firstIndex + 1 + this.getIndexOfBatteryAfterIndex(capacitySecondLetter, firstIndex);
                    if(firstIndex >= 0 && secondIndex >= 0 && firstIndex < secondIndex) {
                        joltage = capacityFirstLetter * 10 + capacitySecondLetter;
                        console.log(`Found batteries with capacities ${capacityFirstLetter} and ${capacitySecondLetter} at indices ${firstIndex} and ${secondIndex}, resulting in joltage ${joltage}`);
                        return joltage;
                    }
                }
            }
        }
        return joltage;
    }

    getJoltagePart2(): number {
        let joltage = 0;



        return joltage;
    }

}