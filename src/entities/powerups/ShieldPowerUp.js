import PowerUp from './PowerUp.js';
import { COLORS } from '../../globals.js';

export default class ShieldPowerUp extends PowerUp {
    constructor(opts = {}) {
        super(opts);
    }

    applyTo(player, playState) {
        // If currently immune, do not allow picking up another shield
        if (playState.playerInvulnerableTimer > 0) {
            return; // leave power-up so it can be picked up later
        }
        // Grant one-hit shield
        playState.playerShieldActive = true;
        // clear any existing immunity just in case
        playState.playerInvulnerableTimer = 0;
        this.isAlive = false;
    }

    render(ctx) {
        ctx.fillStyle = COLORS.POWERUP_SHIELD || '#3498db';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
