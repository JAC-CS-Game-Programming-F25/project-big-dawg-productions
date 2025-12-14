import PowerUp from './PowerUp.js';
import { COLORS, WEAPON_DURATION } from '../../globals.js';

export default class WeaponPowerUp extends PowerUp {
    constructor(opts = {}) {
        super(opts);
    }

    applyTo(player, playState) {
        playState.weaponTimer = WEAPON_DURATION;
        playState.canShoot = true;
        this.isAlive = false;
    }

    render(ctx) {
        ctx.fillStyle = COLORS.POWERUP_WEAPON || '#e74c3c';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
