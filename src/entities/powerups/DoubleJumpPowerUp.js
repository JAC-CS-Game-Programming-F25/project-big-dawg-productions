import PowerUp from './PowerUp.js';
import { COLORS, images } from '../../globals.js';

export default class DoubleJumpPowerUp extends PowerUp {
    constructor(opts = {}) {
        super(opts);
    }

    applyTo(player, playState) {
        // Grant a one-time double jump (no timer)
        playState.canDoubleJump = true;
        this.isAlive = false;
    }

    render(ctx) {
        const sprite = images.get('doublejump_powerup');
        if (sprite) {
            sprite.render(this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = COLORS.POWERUP_JUMP || '#2ecc71';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
