import Enemy from './Enemy.js';
import { COLORS, CANVAS_WIDTH } from '../../globals.js';

export default class FlyingEnemy extends Enemy {
    constructor({ x = 0, y = 0, width = 28, height = 20, speed = 120 } = {}) {
        super({ x, y, width, height, speed });
    }

    update(dt) {
        this.hover(dt);
        super.update(dt);
        // reverse at screen bounds
        if (this.x < 0) { this.x = 0; this.direction = 1; }
        if (this.x + this.width > CANVAS_WIDTH) { this.x = CANVAS_WIDTH - this.width; this.direction = -1; }
    }

    hover(dt) {
        // simple hover: horizontal patrol
        this.vx = this.direction * this.speed;
    }

    render(ctx) {
        ctx.fillStyle = COLORS.ENEMY_FLYING || '#e67e22';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
