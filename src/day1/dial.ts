export class Dial {
    private position: number = 50;

    constructor() {}

    rotate(direction: string, clicks: number): void {
        this.position = this.positionAfterRotation(direction, clicks);
    }

    positionAfterRotation(direction: string, clicks: number): number {
        clicks = clicks % 100; // Normalize clicks to within one full rotation
        switch(direction) {
            case 'L':
                return (this.position - clicks + 100) % 100;
            case 'R':
                return (this.position + clicks) % 100;
            default:
                throw new Error("Invalid direction: " + direction);
        }
    }

    doesRotationMoveOverOrEndOnZero(direction: string, clicks: number): boolean {
        if(clicks >= 100  || clicks <= 0) {
            throw new Error("Clicks must be between 1 and 99 for this check.");
        }
        if(this.position === 0) {
            // Already on zero and since cannot do full rotation here, will not touch zero again
            return false;
        }
        if(direction === 'L') {
            return (this.position - clicks) <= 0;
        }
        else if(direction === 'R') {
            return (this.position + clicks) >= 100;
        }
        return false;
    }

    countOfTouchingZero(direction: string, clicks: number): number {
        let fullRotationTouches = Math.floor(clicks / 100); // each full rotation touches zero once
        let leftOverClicks = clicks - (fullRotationTouches * 100);
        return fullRotationTouches + (this.doesRotationMoveOverOrEndOnZero(direction, leftOverClicks) ? 1 : 0)
    }

    getPosition(): number {
        return this.position;
    }
}