import { JunctionBox } from "../util.js";

export class Playground {
    private junctionBoxes: JunctionBox[] = [];
    private circuits: Map<number, Set<number>> = new Map(); // connection IDs per circuit ID
    private latestConnectionID: number = 0;
    private latestCircuitID: number = 0;
    private connectionsHandled: JunctionBox[][] = [];
    private boxesThatCausedLastMerge: JunctionBox[] = [];

    constructor() { }

    setData(input: string[]): void {
        this.junctionBoxes = input.map(line => {
            return {
                x: parseInt(line.split(',')[0]),
                y: parseInt(line.split(',')[1]),
                z: parseInt(line.split(',')[2]),
                connectionIDs: [],
                circuitID: 0
            };
        })
    }

    createCircuits(): void {
        let closestBoxes;
        while(this.countOfExistingCircuits() > 1) {
            closestBoxes = this.getClosestBoxes();
            if(!this.areBoxesConnectedOrInSameCircuit(closestBoxes[0],closestBoxes[1])) {
                this.connectBoxes(closestBoxes[0], closestBoxes[1]);
            }
            this.connectionsHandled.push(closestBoxes);
        }
        if(!closestBoxes) {throw new Error('Dumbman')}
        this.boxesThatCausedLastMerge = closestBoxes;

        // just getting the largest circuits to the start of the map
        let sorted = Array.from(this.circuits).sort((a, b) => b[1].size - a[1].size);
        this.circuits.clear();
        sorted.forEach((circuit) => {
            this.circuits.set(circuit[0], circuit[1]);
        })
    }

    getCircuits(): Map<number, Set<number>> {
        return this.circuits
    }

    getBoxesOfCircuit(circuitID: number): JunctionBox[] {
        return this.junctionBoxes.filter(box => box.circuitID === circuitID);
    }

    getResultForPart2(): number {
        return this.boxesThatCausedLastMerge[0].x * this.boxesThatCausedLastMerge[1].x;
    }

    private calculateDistance(a: JunctionBox, b: JunctionBox): number {
        return Math.sqrt(
            Math.pow(b.x - a.x, 2) +
            Math.pow(b.y - a.y, 2) +
            Math.pow(b.z - a.z, 2)
        );
    }

    private getClosestBoxes(): JunctionBox[] {
        let closestBoxes: JunctionBox[] = [];
        let minDistance = Number.MAX_VALUE;
        for (let i = 0; i < this.junctionBoxes.length; i++) {
            for (let j = i + 1; j < this.junctionBoxes.length; j++) {
                const distance = this.calculateDistance(this.junctionBoxes[i], this.junctionBoxes[j]);
                if (distance < minDistance && !this.isConnectionHandled(this.junctionBoxes[i], this.junctionBoxes[j])) {
                    minDistance = distance;
                    closestBoxes = [this.junctionBoxes[i], this.junctionBoxes[j]];
                }
            }
        }
        return closestBoxes;
    }

    private connectBoxes(a: JunctionBox, b: JunctionBox): void {
        this.latestConnectionID += 1;
        a.connectionIDs.push(this.latestConnectionID);
        b.connectionIDs.push(this.latestConnectionID);

        if(a.circuitID > 0 && b.circuitID > 0) {
            if(!this.circuits.get(b.circuitID)) {
                throw new Error(`Nincs ilyen circuit: ${b.circuitID}`)
            }
            if(!this.circuits.get(a.circuitID)) {
                throw new Error(`Nincs ilyen circuit: ${a.circuitID}`)
            }

            // had to create a new variable with the value as the forEach down below just casually overwrited the value of b.circuitID
            // and in the next iteration this new value was compared. thus a couple of circuitIDs were not updated and pointed to a non-existing circuit....
            let circuitIDtoDelete = Number(b.circuitID)

            this.circuits.get(circuitIDtoDelete)?.forEach(connID => this.circuits.get(a.circuitID)?.add(connID));
            this.circuits.delete(circuitIDtoDelete)
            this.circuits.get(a.circuitID)?.add(this.latestConnectionID)
            this.junctionBoxes.forEach(box => {
                if(box.circuitID ===circuitIDtoDelete) box.circuitID = a.circuitID;
            })
            return;
        }
        if(a.circuitID > 0 && b.circuitID === 0) {
            this.circuits.get(a.circuitID)?.add(this.latestConnectionID)
            b.circuitID = a.circuitID;
            return;
        }
        if(a.circuitID === 0 && b.circuitID > 0) {
            this.circuits.get(b.circuitID)?.add(this.latestConnectionID)
            a.circuitID = b.circuitID;
            return;
        }
        if(a.circuitID === 0 && b.circuitID === 0) {
            this.latestCircuitID += 1;
            this.circuits.set(this.latestCircuitID, new Set([this.latestConnectionID]));
            a.circuitID = this.latestCircuitID;
            b.circuitID = this.latestCircuitID;
            return;
        }
    }

    private areBoxesConnectedOrInSameCircuit(a: JunctionBox, b: JunctionBox): boolean {
        let directlyConnected = a.connectionIDs.some(id => b.connectionIDs.includes(id));
        let inTheSameCircuitButNotConnected = a.circuitID > 0 && b.circuitID > 0 && a.circuitID === b.circuitID;
        return directlyConnected || inTheSameCircuitButNotConnected;
    }

    private isConnectionHandled(a: JunctionBox, b: JunctionBox): boolean {
        return this.connectionsHandled.some(connection => {
            return ( this.isSameBox(connection[0], a) && this.isSameBox(connection[1], b) ) || ( this.isSameBox(connection[0], b) && this.isSameBox(connection[1], a) )
        })
    }

    private isSameBox(a: JunctionBox, b: JunctionBox): boolean {
        return (b.x === a.x && b.y === a.y && b.z === a.z);
    }

    private countOfExistingCircuits(): number {
        return new Set(this.junctionBoxes.map(box => box.circuitID)).size + this.junctionBoxes.filter(box => box.circuitID === 0).length;
    }
}