import PowerUp from './PowerUp.js';
import { COLORS, SHIELD_DURATION, images } from '../../globals.js';

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
        const sprite = images.get('shield_powerup');
        if (sprite) {
            sprite.render(this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = COLORS.POWERUP_SHIELD || '#3498db';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
