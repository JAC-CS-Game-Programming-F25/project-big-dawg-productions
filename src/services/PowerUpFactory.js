import ShieldPowerUp from '../entities/powerups/ShieldPowerUp.js';
import DoubleJumpPowerUp from '../entities/powerups/DoubleJumpPowerUp.js';
import GravityFlipPowerUp from '../entities/powerups/GravityFlipPowerUp.js';

export default class PowerUpFactory {
    static create(type, options) {
        switch (type) {
            case 'shield':
                return new ShieldPowerUp(options);
            case 'doubleJump':
                return new DoubleJumpPowerUp(options);
            case 'gravityFlip':
                return new GravityFlipPowerUp(options);
            default:
                return new ShieldPowerUp(options);
        }
    }
}
