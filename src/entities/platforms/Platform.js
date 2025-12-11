import GameObject from '../../objects/GameObject.js';

export default class Platform extends GameObject {
    constructor({ x = 0, y = 0, width = 128, height = 16, type = 'normal' } = {}) {
        super({ x, y, width, height });
        this.type = type;
        this.isSolid = true;
    }

    // top-only collision check: entity falling onto platform
    collidesTop(entity, buffer = 5) {
        const isFalling = entity.vy > 0;
        const withinX = entity.right > this.left && entity.left < this.right;
        const crossedTop = entity.bottom >= this.top && entity.bottom <= this.top + this.height + buffer;
        return isFalling && withinX && crossedTop;
    }

    onLand(entity) {
        entity.y = this.top - entity.height;
        entity.vy = 0;
    }

    update(dt) {}
}