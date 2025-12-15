import Platform from './Platform.js';
import Sprite from '../../../lib/Sprite.js';
import { COLORS, images } from '../../globals.js';

export default class BouncyPlatform extends Platform {
    constructor({ x = 0, y = 0, width = 120, height = 12, bounceVelocity = -2000 } = {}) {
        super({ x, y, width, height });
        this.bounceVelocity = bounceVelocity;
        this._tiles = null;
    }

    onLand(entity) {
        // Bounce the player with stronger upward velocity
        entity.y = this.y - entity.height;
        entity.vy = this.bounceVelocity;
    }

    render(ctx) {
        const sheet = images.get('bouncy_platform_sheet');
        if (sheet && !this._tiles) {
            // tileset is 6x4 of 32x32; take first 3 tiles from top row
            const tileW = Math.floor(sheet.width / 6);
            const tileH = Math.floor(sheet.height / 4);
            this._tiles = [0,1,2].map(i => new Sprite(sheet, i * tileW, 0, tileW, tileH));
        }
        if (this._tiles) {
            // draw the three tiles combined, stretched to platform width/height
            const segmentW = this.width / 3;
            const scaleX = segmentW / this._tiles[0].width;
            const scaleY = this.height / this._tiles[0].height;
            // left, middle, right
            this._tiles[0].render(this.x, this.y, { x: scaleX, y: scaleY });
            this._tiles[1].render(this.x + segmentW, this.y, { x: scaleX, y: scaleY });
            this._tiles[2].render(this.x + segmentW * 2, this.y, { x: scaleX, y: scaleY });
        } else {
            ctx.fillStyle = COLORS.PLATFORM_BOUNCY;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
