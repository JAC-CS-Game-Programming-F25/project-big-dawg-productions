import PowerUp from './PowerUp.js';
import { COLORS, SHIELD_DURATION } from '../../globals.js';

export default class ShieldPowerUp extends PowerUp {
    constructor(opts = {}) {
        super(opts);
    }

    applyTo(player, playState) {
        // If currently immune, do not allow picking up another shield
        if (player.isInvincible && player.isInvincible()) {
            return;
        }
        // Grant temporary invincibility per architecture
        player.enableInvincibility(SHIELD_DURATION);
        this.isAlive = false;
    }

    render(ctx) {
        ctx.fillStyle = COLORS.POWERUP_SHIELD || '#3498db';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
