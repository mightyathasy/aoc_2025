export class Bank {
    private  batteries: number[] = [];
    private turnedOnBatteryLimit: number = 12;
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

    getJoltage(bankSegment?: number[], joltage?: number): number {
        bankSegment = bankSegment || this.batteries;

        for(let capacityFirstLetter = 9; capacityFirstLetter >= 1; capacityFirstLetter--) {

            let foundHighestCapacityIndex = bankSegment.findIndex(b => b === capacityFirstLetter);

            if(foundHighestCapacityIndex > -1) {
                let currentJoltage = (joltage?.toString() || "") + capacityFirstLetter.toString();

                // If we meet the battery count limit, then return with the jolly-joltage..
                if(currentJoltage.length === this.turnedOnBatteryLimit) {
                    return Number(currentJoltage);
                }

                // RECURSION HAHAHAHAHHAHAHAHAHA
                let nextBatteriesJoltage = this.getJoltage(bankSegment.slice(foundHighestCapacityIndex + 1), Number(currentJoltage));

                if(nextBatteriesJoltage > -1) {
                    return nextBatteriesJoltage;
                }
            }

        }
        return -1;
    }

}