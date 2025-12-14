import Enemy from './Enemy.js';
import { COLORS, CANVAS_WIDTH } from '../../globals.js';

export default class GroundEnemy extends Enemy {
    constructor({ x = 0, y = 0, width = 32, height = 24, speed = 100, range = 160 } = {}) {
        super({ x, y, width, height, speed });
        this.originX = x;
        this.range = range;
    }

    update(dt) {
        this.vx = this.direction * this.speed;
        super.update(dt);
        const dx = this.x - this.originX;
        if (Math.abs(dx) >= this.range) {
            this.x = this.originX + Math.sign(dx) * this.range;
            this.direction *= -1;
        }
    }

    render(ctx) {
        ctx.fillStyle = COLORS.ENEMY_GROUND || '#8e44ad';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
