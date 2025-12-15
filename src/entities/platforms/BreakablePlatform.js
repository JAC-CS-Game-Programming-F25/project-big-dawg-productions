import Platform from './Platform.js';
import Sprite from '../../../lib/Sprite.js';
import { COLORS, images } from '../../globals.js';

export default class BreakablePlatform extends Platform {
    constructor({ x = 0, y = 0, width = 120, height = 12, breakDelay = 0.2 } = {}) {
        super({ x, y, width, height });
        this.isBreaking = false;
        this.breakTimer = 0;
        this.breakDelay = breakDelay; // seconds after landing to break
        this._tiles = null;
    }

    onLand(entity) {
        // Allow landing, then start breaking timer
        entity.y = this.y - entity.height;
        entity.vy = 0;
        this.isBreaking = true;
        this.breakTimer = this.breakDelay;
    }

    update(dt) {
        if (this.isBreaking) {
            this.breakTimer -= dt;
            if (this.breakTimer <= 0) {
                this.isAlive = false; // remove from world
            }
        }
    }

    render(ctx) {
        const sheet = images.get('breakable_platform_sheet');
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
            ctx.fillStyle = COLORS.PLATFORM_BREAKABLE;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        if (this.isBreaking) {
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
