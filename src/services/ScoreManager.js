export default class ScoreManager {
    constructor() {
        this.score = 0;
        this.highestY = null; // track highest ascent (lowest Y value since up is decreasing Y)
    }

    add(points) {
        this.score += Math.floor(points);
    }

    reset() {
        this.score = 0;
        this.highestY = null;
    }

    updateHeight(currentY) {
        if (this.highestY === null || currentY < this.highestY) {
            this.highestY = currentY;
        }
    }

    getHeightAchieved(baseY) {
        if (this.highestY === null) return 0;
        return Math.max(0, baseY - this.highestY);
    }
}