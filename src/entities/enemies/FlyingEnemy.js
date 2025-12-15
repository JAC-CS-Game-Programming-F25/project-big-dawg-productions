import Enemy from './Enemy.js';
import Animation from '../../../lib/Animation.js';
import Sprite from '../../../lib/Sprite.js';
import { COLORS, CANVAS_WIDTH, images, ANIMATION_FPS } from '../../globals.js';

export default class FlyingEnemy extends Enemy {
    constructor({ x = 0, y = 0, width = 28, height = 20, speed = 120 } = {}) {
        super({ x, y, width, height, speed });
        // Setup idle animation from eye monster spritesheet (8 frames, use first 4)
        const sheet = images.get('eye_monster_sheet');
        if (sheet) {
            const totalFrames = 8;
            const useFrames = 4;
            const stepX = sheet.width / totalFrames; // non-integer friendly spacing
            const tileW = Math.floor(stepX);
            const tileH = sheet.height;
            const sprites = [];
            for (let i = 0; i < useFrames; i++) {
                const centerX = i * stepX + stepX / 2;
                const sx = Math.max(0, Math.min(sheet.width - tileW, Math.floor(centerX - tileW / 2)));
                const sy = 0;
                sprites.push(new Sprite(sheet, sx, sy, tileW, tileH));
            }
            const scaleX = this.width / tileW;
            const scaleY = this.height / tileH;
            this._enemyFrames = sprites.map(s => ({ render: (x, y) => s.render(x, y, { x: scaleX, y: scaleY }) }));
            this._anim = new Animation([...Array(this._enemyFrames.length).keys()], 1 / (ANIMATION_FPS.ENEMY_PATROL || 6));
            this.sprite = {
                render: (ctx, x, y) => {
                    const idx = this._anim.getCurrentFrame();
                    this._enemyFrames[idx].render(x, y);
                }
            };
        }
    }

    update(dt) {
        this.hover(dt);
        super.update(dt);
        // reverse at screen bounds
        if (this.x < 0) { this.x = 0; this.direction = 1; }
        if (this.x + this.width > CANVAS_WIDTH) { this.x = CANVAS_WIDTH - this.width; this.direction = -1; }
    }

    hover(dt) {
        // simple hover: horizontal patrol
        this.vx = this.direction * this.speed;
    }

    render(ctx) {
        if (this.sprite && this.sprite.render) {
            // advance animation with a nominal dt based on global frame rate
            if (this._anim) this._anim.update(1/60);
            this.sprite.render(ctx, this.x, this.y);
        } else {
            ctx.fillStyle = COLORS.ENEMY_FLYING || '#e67e22';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
