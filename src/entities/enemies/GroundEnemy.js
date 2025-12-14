import Enemy from './Enemy.js';
import { COLORS } from '../../globals.js';

export default class GroundEnemy extends Enemy {
    constructor({ x = 0, y = 0, width = 32, height = 24, platform = null, offsetX = 0 } = {}) {
        super({ x, y, width, height, speed: 0 });
        this.platform = platform; // platform the enemy stands on
        this.offsetX = offsetX;   // local offset from platform.x
    }

    update(dt) {
        // Ground enemy does not move on its own; it follows the platform
        // If attached to a moving platform, it inherits the platform's movement
        if (this.platform) {
            this.x = this.platform.x + this.offsetX;
            this.y = this.platform.y - this.height; // stand on top
            this.checkPlatformEdge();
        }
        // No autonomous movement
    }

    checkPlatformEdge() {
        if (!this.platform) return;
        // keep within platform bounds
        const minX = this.platform.x;
        const maxX = this.platform.x + this.platform.width - this.width;
        if (this.x < minX) this.x = minX;
        if (this.x > maxX) this.x = maxX;
    }

    render(ctx) {
        ctx.fillStyle = COLORS.ENEMY_GROUND || '#8e44ad';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
