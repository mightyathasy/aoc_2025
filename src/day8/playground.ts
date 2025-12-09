import { JunctionBox } from "../util.js";

export class Playground {
    private junctionBoxes: JunctionBox[] = [];
    private circuits: Map<number, Set<number>> = new Map(); // connection IDs per circuit ID
    private latestConnectionID: number = 0;
    private latestCircuitID: number = 0;
    private skippedConnections: JunctionBox[][] = [];
    private connectionLimiter: number = 0;

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
        while(this.connectionLimiter < 10) {
            let closestBoxes = this.getClosestBoxes();
            if(!this.areBoxesConnectedOrInSameCircuit(closestBoxes[0],closestBoxes[1])) {
                this.connectBoxes(closestBoxes[0], closestBoxes[1]);
            } else {
                this.skippedConnections.push(closestBoxes);
            }
            this.connectionLimiter++;
        }
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
                if (distance < minDistance && !this.isConnectionSkipped(this.junctionBoxes[i], this.junctionBoxes[j])) {
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
            this.circuits.get(b.circuitID)?.forEach(connID => this.circuits.get(a.circuitID)?.add(connID));
            this.circuits.delete(b.circuitID)
            this.circuits.get(a.circuitID)?.add(this.latestConnectionID)
            this.junctionBoxes.forEach(box => {
                if(box.circuitID === b.circuitID) box.circuitID = a.circuitID;
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

    private isConnectionSkipped(a: JunctionBox, b: JunctionBox): boolean {
        return this.skippedConnections.some(connection => {
            return connection.some(box => {
                return (box.x === a.x && box.y === a.y && box.z === a.z) || (box.x === b.x && box.y === b.y && box.z === b.z);
            })
        })
    }
}