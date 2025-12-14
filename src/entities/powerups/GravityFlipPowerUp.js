import PowerUp from './PowerUp.js';
import { COLORS, GRAVITY_FLIP_DURATION } from '../../globals.js';

export default class GravityFlipPowerUp extends PowerUp {
    constructor(opts = {}) {
        super(opts);
    }

    applyTo(player, playState) {
        // Activate gravity flip for a limited duration
        playState.gravityFlipTimer = GRAVITY_FLIP_DURATION;
        playState.gravityFlipped = true;
        this.isAlive = false;
    }

    render(ctx) {
        ctx.fillStyle = COLORS.POWERUP_GRAVITY || '#9b59b6';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
