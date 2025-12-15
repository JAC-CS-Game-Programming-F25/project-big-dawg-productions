import GameEntity from '../../entities/GameEntity.js';

export default class Enemy extends GameEntity {
    constructor({ x = 0, y = 0, width = 32, height = 32, speed = 80, patrolSpeed = null } = {}) {
        super({ x, y, width, height });
        this.speed = speed;
        this.patrolSpeed = patrolSpeed ?? speed;
        this.direction = 1;
    }

    update(dt) {
        super.update(dt);
    }

    patrol(dt) {
        this.vx = this.direction * this.patrolSpeed;
    }

    render(ctx) {
        ctx.fillStyle = '#AA3333';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
