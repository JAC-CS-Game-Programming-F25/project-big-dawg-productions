import PowerUp from './PowerUp.js';
import { COLORS, GRAVITY_FLIP_DURATION } from '../../globals.js';

export default class GravityFlipPowerUp extends PowerUp {
    constructor(opts = {}) {
        super(opts);
    }

    applyTo(player, playState) {
        // Activate gravity flip via Player
        player.flipGravity(GRAVITY_FLIP_DURATION);
        this.isAlive = false;
    }

    render(ctx) {
        ctx.fillStyle = COLORS.POWERUP_GRAVITY || '#9b59b6';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
