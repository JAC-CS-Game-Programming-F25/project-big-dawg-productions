import Platform from './Platform.js';
import { COLORS } from '../../globals.js';

export default class BouncyPlatform extends Platform {
    constructor({ x = 0, y = 0, width = 120, height = 12, bounceVelocity = -2000 } = {}) {
        super({ x, y, width, height });
        this.bounceVelocity = bounceVelocity;
    }

    onLand(entity) {
        // Bounce the player with stronger upward velocity
        entity.y = this.y - entity.height;
        entity.vy = this.bounceVelocity;
    }

    render(ctx) {
        ctx.fillStyle = COLORS.PLATFORM_BOUNCY;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
