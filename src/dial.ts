export class Dial {
    private position: number = 50;

    constructor() {}

    rotate(direction: string, clicks: number): void {
        if (direction === 'L') {
            this.position -= clicks;
        } else if (direction === 'R') {
            this.position += clicks;
        }
        this.position = (this.position + 100) % 100; // maybe an enum would be better later on :D based on experience with this shitty puzzles
    }

    doesRotationMoveOverZero(direction: string, clicks: number): boolean {
        if(this.position === 0) {
            return false;
        }
        if(direction === 'L') {
            return this.position - clicks < 0;
        }
        else if(direction === 'R') {
            return this.position + clicks >= 100;
        }
        return false;
    }

    doesRotationEndOnZero(direction: string, clicks: number): boolean {
        if(direction === 'L') {
            return (this.position - clicks + 100) % 100 === 0;
        }
        else if(direction === 'R') {
            return (this.position + clicks) % 100 === 0;
        }
        return false;
    }

    countOfTouchingZero(direction: string, clicks: number): number {
        let result = Math.floor(clicks / 100); // each full rotation touches zero once
        let leftOverClicks = clicks % 100;
        return result + (this.doesRotationMoveOverZero(direction, leftOverClicks) || this.doesRotationEndOnZero(direction, leftOverClicks) ? 1 : 0);
    }

    getPosition(): number {
        return this.position;
    }
}