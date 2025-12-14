import ShieldPowerUp from '../entities/powerups/ShieldPowerUp.js';

export default class PowerUpFactory {
    static create(type, options) {
        switch (type) {
            case 'shield':
                return new ShieldPowerUp(options);
            default:
                return new ShieldPowerUp(options);
        }
    }
}
