import PowerUp from './PowerUp.js';
import { COLORS } from '../../globals.js';

export default class ShieldPowerUp extends PowerUp {
    constructor(opts = {}) {
        super(opts);
    }

    applyTo(player, playState) {
        // Grant one-hit shield
        playState.playerShieldActive = true;
        this.isAlive = false;
    }

    render(ctx) {
        ctx.fillStyle = COLORS.POWERUP_SHIELD || '#3498db';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
