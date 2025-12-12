import Platform from './Platform.js';
import { COLORS, CANVAS_WIDTH } from '../../globals.js';

export default class MovingPlatform extends Platform {
    constructor({ x = 0, y = 0, width = 120, height = 12, speed = 80, range = 120 } = {}) {
        super({ x, y, width, height });
        this.speed = speed;            // pixels per second
        this.range = range;            // horizontal oscillation range
        this.originX = x;              // starting x
        this.direction = 1;            // 1 right, -1 left
    }

    update(dt) {
        this.x += this.direction * this.speed * dt;
        const dx = this.x - this.originX;
        if (Math.abs(dx) >= this.range) {
            // clamp and reverse direction
            this.x = this.originX + Math.sign(dx) * this.range;
            this.direction *= -1;
        }
    }

    render(ctx) {
        ctx.fillStyle = COLORS.PLATFORM_MOVING;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
