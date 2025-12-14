import PowerUp from './PowerUp.js';
import { COLORS, DOUBLE_JUMP_DURATION } from '../../globals.js';

export default class DoubleJumpPowerUp extends PowerUp {
    constructor(opts = {}) {
        super(opts);
    }

    applyTo(player, playState) {
        // Activate double jump for a limited duration
        playState.doubleJumpTimer = DOUBLE_JUMP_DURATION;
        // Allow double jump immediately on next airborne state
        playState.canDoubleJump = true;
        this.isAlive = false;
    }

    render(ctx) {
        ctx.fillStyle = COLORS.POWERUP_JUMP || '#2ecc71';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
