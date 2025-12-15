import GameEntity from '../entities/GameEntity.js';
import { images } from '../globals.js';

export default class Projectile extends GameEntity {
    constructor({ x = 0, y = 0, width = 8, height = 8, vx = 0, vy = 0, speed = 600, damage = 1 } = {}) {
        super({ x, y, width, height });
        this.vx = vx;
        this.vy = vy;
        this.velocity.set(vx, vy);
        this.speed = speed;
        this.damage = damage;
    }

    move(dt) {
        this.update(dt);
    }

    render(ctx) {
        const g = images.get && images.get('laser_bolt');
        if (g && g.render) {
            g.render(this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = '#ffdd55';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
