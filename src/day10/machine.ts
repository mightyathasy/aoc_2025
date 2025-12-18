import { getNLongCombinationsOfNumbers } from "../util.js";

export class Machine {
    private indicatorLightDiagram: string[] = [];
    private buttonWiringSchematics: Map<number, number[]> = new Map();
    private fastestConfiguringSequence: number[] = [];
    private joltageRequirements: number[] = [];

    constructor(inputLine: string) {
        this.indicatorLightDiagram = (inputLine.match(/\[.*]/g) ?? [])[0]?.split('').filter(c => c!=='['&&c!==']') ?? [];

        // this should be a map....
        let buttonWiringSchematics = (inputLine.match(/\(.*\)/g) ?? [])[0]?.split(' ').map(schematic => schematic.split('').filter(c => c!=='('&&c!==')'&&c!==',').map(c => parseInt(c))) ?? [];
        for(let i = 0; i < buttonWiringSchematics.length; i++ ) {
            this.buttonWiringSchematics.set(i, buttonWiringSchematics[i]);
        }

        this.joltageRequirements = (inputLine.match(/\{.*}/g) ?? [])[0]?.split('').filter(c => c !== '{' && c !== '}').join('').split(',').map(c => parseInt(c)) ?? [];
    }

    calculateFastestConfiguringSequence(): number {
        let buttonPushesUsed = 0;
        let sequenceFound = false;

        do {
            buttonPushesUsed++
            for(const buttonIDList of getNLongCombinationsOfNumbers(buttonPushesUsed, Array.from(this.buttonWiringSchematics.keys()))) {
                if(sequenceFound) { break; }

                // Part 1
                // sequenceFound = this.applyButtonPushesToSwitchLights(buttonIDList);

                // Part 2
                sequenceFound = this.applyButtonPushesToIncreaseJoltageLevels(buttonIDList);

                if(sequenceFound) {
                    this.fastestConfiguringSequence = buttonIDList;
                    break;
                }
            }
        } while (!sequenceFound && buttonPushesUsed < 999); // using a safety-belt

        return this.fastestConfiguringSequence.length;
    }

    getFastestConfiguringSequence(): number {
        return this.fastestConfiguringSequence.length;
    }

    private applyButtonPushForMachine(indicatorLightMap: string[], button: number[]): string[] {
        if(button.length === 0) { throw new Error("Cannot use button that switches no lights"); }
        button.forEach(lightIndex => {
            indicatorLightMap[lightIndex] = indicatorLightMap[lightIndex] === '.' ? '#' : '.';
        })
        return indicatorLightMap
    }

    private applyButtonPushesToSwitchLights(buttonIDList: number[]): boolean {
        let indicatorLightMap = this.indicatorLightDiagram.map(() => '.');
        buttonIDList.forEach(buttonID => this.applyButtonPushForMachine(indicatorLightMap, this.buttonWiringSchematics.get(buttonID) ?? []))
        return indicatorLightMap.every((light, index) => this.indicatorLightDiagram[index] === light); // if the pattern matches the lights turned on...
    }

    private applyButtonPushForMachineJoltage(joltageLevels: number[], button: number[]): number[] {
        if(button.length === 0) { throw new Error("Cannot use button that switches no lights"); }
        button.forEach(lightIndex => {
            joltageLevels[lightIndex] = joltageLevels[lightIndex] += 1;
        })
        return joltageLevels;
    }

    applyButtonPushesToIncreaseJoltageLevels(buttonIDList: number[]): boolean {
        let joltageLevels = this.joltageRequirements.map(() => 0);
        // buttons should be compressed somehow to win on performance
        buttonIDList.forEach(buttonID => this.applyButtonPushForMachineJoltage(joltageLevels, this.buttonWiringSchematics.get(buttonID) ?? []))
        return  joltageLevels.every((joltageLevel, index) => this.joltageRequirements[index] === joltageLevel);
    }

}