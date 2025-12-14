import GameObject from '../../objects/GameObject.js';

export default class PowerUp extends GameObject {
    constructor({ x = 0, y = 0, width = 24, height = 24 } = {}) {
        super({ x, y, width, height });
    }

    applyTo(player, playState) {
        // override in subclasses
    }

    render(ctx) {
        ctx.fillStyle = '#44AAFF';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
