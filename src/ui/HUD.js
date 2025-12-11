import { UI_COLOR, UI_FONT_SIZE } from '../globals.js';

export default class HUD {
    constructor(scoreManager) {
        this.scoreManager = scoreManager;
    }

    render(ctx, cameraY, playerY, baseY) {
        ctx.fillStyle = UI_COLOR;
        ctx.font = `${UI_FONT_SIZE}px Arial`;

        const height = this.scoreManager.getHeightAchieved(baseY);
        ctx.fillText(`Score: ${this.scoreManager.score}`, 20, 30);
        ctx.fillText(`Height: ${Math.floor(height)} px`, 20, 60);
    }
}