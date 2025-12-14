import { UI_COLOR, UI_FONT_SIZE } from '../globals.js';

export default class HUD {
    constructor(scoreManager) {
        this.scoreManager = scoreManager;
        this.currentMilestone = null; // 'Bronze' | 'Silver' | 'Gold' | null
    }

    render(ctx, cameraY, playerY, baseY, { powerUps = [] } = {}) {
        // Save context state before HUD rendering
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset any transforms
        
        ctx.fillStyle = UI_COLOR;
        ctx.font = `${UI_FONT_SIZE}px Arial`;

        const height = this.scoreManager.getHeightAchieved(baseY);
        ctx.fillText(`Score: ${this.scoreManager.score}`, 120, 30);
        ctx.fillText(`Height: ${Math.floor(height)} px`, 120, 60);

        // Milestone reached indicator
        ctx.fillText(`Milestone: ${this.currentMilestone || 'None'}`, 120, 90);

        // Power-ups panel: shows active power-ups and remaining time if any
        ctx.fillText('Power-ups:', 120, 120);
        let lineY = 150;
        if (powerUps.length === 0) {
            ctx.fillText('None', 120, lineY);
        } else {
            for (const p of powerUps) {
                const label = p.label || 'Unknown';
                const seconds = typeof p.seconds === 'number' ? Math.max(0, p.seconds).toFixed(1) : null;
                const text = seconds !== null ? `${label}: ${seconds}s` : `${label}: Active`;
                ctx.fillText(text, 120, lineY);
                lineY += 24;
            }
        }
        
        ctx.restore();
    }
}