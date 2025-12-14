import { UI_COLOR, UI_FONT_SIZE } from '../globals.js';

export default class HUD {
    constructor(scoreManager) {
        this.scoreManager = scoreManager;
        this.currentMilestone = null; // 'Bronze' | 'Silver' | 'Gold' | null
    }

    render(ctx, cameraY, playerY, baseY, { immunitySeconds = 0, shieldReady = false, weaponSeconds = 0 } = {}) {
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

        // Immunity indicator: show Active when shield is ready; countdown when timer running; None otherwise
        if (immunitySeconds > 0) {
            const secs = Math.max(0, immunitySeconds).toFixed(1);
            ctx.fillText(`Immunity: ${secs}s`, 120, 120);
        } else if (shieldReady) {
            ctx.fillText('Immunity: Active', 120, 120);
        } else {
            ctx.fillText('Immunity: None', 120, 120);
        }

        // Weapon countdown when active
        if (weaponSeconds > 0) {
            const wsecs = Math.max(0, weaponSeconds).toFixed(1);
            ctx.fillText(`Weapon: ${wsecs}s`, 120, 150);
        } else {
            ctx.fillText('Weapon: Inactive', 120, 150);
        }
        
        ctx.restore();
    }
}