import Platform from './Platform.js';
import Sprite from '../../../lib/Sprite.js';
import { images, COLORS, CANVAS_WIDTH } from '../../globals.js';

export default class MovingPlatform extends Platform {
    constructor({ x = 0, y = 0, width = 120, height = 12, speed = 80, range = 120 } = {}) {
        super({ x, y, width, height });
        this.speed = speed;            // pixels per second
        this.range = range;            // horizontal oscillation range
        this.originX = x;              // starting x
        this.direction = 1;            // 1 right, -1 left
        this._tiles = null;
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
        const sheet = images.get('moving_platform_sheet');
        if (sheet && !this._tiles) {
            const tileW = Math.floor(sheet.width / 6);
            const tileH = Math.floor(sheet.height / 4);
            this._tiles = [0,1,2].map(i => new Sprite(sheet, i * tileW, 0, tileW, tileH));
        }
        if (this._tiles) {
            const segmentW = this.width / 3;
            const scaleX = segmentW / this._tiles[0].width;
            const scaleY = this.height / this._tiles[0].height;
            this._tiles[0].render(this.x, this.y, { x: scaleX, y: scaleY });
            this._tiles[1].render(this.x + segmentW, this.y, { x: scaleX, y: scaleY });
            this._tiles[2].render(this.x + segmentW * 2, this.y, { x: scaleX, y: scaleY });
        } else {
            ctx.fillStyle = COLORS.PLATFORM_MOVING;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
