import PowerUp from './PowerUp.js';
import { COLORS, WEAPON_DURATION, images } from '../../globals.js';

export default class WeaponPowerUp extends PowerUp {
    constructor(opts = {}) {
        super(opts);
    }

    applyTo(player, playState) {
        player.enableWeapon(WEAPON_DURATION);
        this.isAlive = false;
    }

    render(ctx) {
        const sprite = images.get('weapon_powerup');
        if (sprite) {
            sprite.render(this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = COLORS.POWERUP_WEAPON || '#e74c3c';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
