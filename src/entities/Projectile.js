import GameObject from '../objects/GameObject.js';

export default class Projectile extends GameObject {
    constructor({ x = 0, y = 0, width = 8, height = 8, vx = 0, vy = 0, speed = 600 } = {}) {
        super({ x, y, width, height });
        this.vx = vx;
        this.vy = vy;
        this.speed = speed;
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    render(ctx) {
        ctx.fillStyle = '#ffdd55';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
