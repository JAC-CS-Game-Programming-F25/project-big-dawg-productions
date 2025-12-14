import Platform from './Platform.js';
import { COLORS } from '../../globals.js';

export default class BreakablePlatform extends Platform {
    constructor({ x = 0, y = 0, width = 120, height = 12, breakDelay = 0.2 } = {}) {
        super({ x, y, width, height });
        this.isBreaking = false;
        this.breakTimer = 0;
        this.breakDelay = breakDelay; // seconds after landing to break
    }

    onLand(entity) {
        // Allow landing, then start breaking timer
        entity.y = this.y - entity.height;
        entity.vy = 0;
        this.isBreaking = true;
        this.breakTimer = this.breakDelay;
    }

    update(dt) {
        if (this.isBreaking) {
            this.breakTimer -= dt;
            if (this.breakTimer <= 0) {
                this.isAlive = false; // remove from world
            }
        }
    }

    render(ctx) {
        ctx.fillStyle = COLORS.PLATFORM_BREAKABLE;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if (this.isBreaking) {
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
