import Platform from './Platform.js';
import Sprite from '../../../lib/Sprite.js';
import { images, UI_COLOR } from '../../globals.js';

export default class NormalPlatform extends Platform {
    constructor(config = {}) {
        super({ ...config, type: 'normal' });
        this._tiles = null;
    }

    render(ctx) {
        const sheet = images.get('normal_platform_sheet');
        if (sheet && !this._tiles) {
            // tileset 6x4; take first 3 tiles in top row like bouncy
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
            // placeholder
            ctx.fillStyle = UI_COLOR;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}