import Enemy from './Enemy.js';
import Animation from '../../../lib/Animation.js';
import Sprite from '../../../lib/Sprite.js';
import { COLORS, images, ANIMATION_FPS } from '../../globals.js';

export default class GroundEnemy extends Enemy {
    constructor({ x = 0, y = 0, width = 32, height = 24, platform = null, offsetX = 0 } = {}) {
        super({ x, y, width, height, speed: 0 });
        this.platform = platform; // platform the enemy stands on
        this.offsetX = offsetX;   // local offset from platform.x

        // Setup sprite animation from 8x8 sheet; use first 8 frames (top row)
        const sheet = images.get('ground_enemy_sheet');
        if (sheet) {
            const cols = 8, rows = 8;
            const tileW = Math.floor(sheet.width / cols);
            const tileH = Math.floor(sheet.height / rows);
            const sprites = [];
            for (let i = 0; i < 8; i++) {
                const sx = i * tileW;
                const sy = 0;
                sprites.push(new Sprite(sheet, sx, sy, tileW, tileH));
            }
            const scaleX = this.width / tileW;
            const scaleY = this.height / tileH;
            this._frames = sprites.map(s => ({ render: (x, y) => s.render(x, y, { x: scaleX, y: scaleY }) }));
            this._anim = new Animation([...Array(this._frames.length).keys()], 1 / (ANIMATION_FPS.ENEMY_PATROL || 6));
            this.sprite = {
                render: (ctx, x, y) => {
                    const idx = this._anim.getCurrentFrame();
                    this._frames[idx].render(x, y);
                }
            };
        }
    }

    update(dt) {
        // Ground enemy does not move on its own; it follows the platform
        // If attached to a moving platform, it inherits the platform's movement
        if (this.platform) {
            this.x = this.platform.x + this.offsetX;
            this.y = this.platform.y - this.height; // stand on top
            this.checkPlatformEdge();
        }
        if (this._anim) this._anim.update(dt);
        // No autonomous movement
    }

    checkPlatformEdge() {
        if (!this.platform) return;
        // keep within platform bounds
        const minX = this.platform.x;
        const maxX = this.platform.x + this.platform.width - this.width;
        if (this.x < minX) this.x = minX;
        if (this.x > maxX) this.x = maxX;
    }

    render(ctx) {
        if (this.sprite && this.sprite.render) {
            this.sprite.render(ctx, this.x, this.y);
        } else {
            ctx.fillStyle = COLORS.ENEMY_GROUND || '#8e44ad';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
