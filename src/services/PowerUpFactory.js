import ShieldPowerUp from '../entities/powerups/ShieldPowerUp.js';
import DoubleJumpPowerUp from '../entities/powerups/DoubleJumpPowerUp.js';
import GravityFlipPowerUp from '../entities/powerups/GravityFlipPowerUp.js';
import WeaponPowerUp from '../entities/powerups/WeaponPowerUp.js';
import PowerUpType from '../enums/PowerUpType.js';

export default class PowerUpFactory {
    static create(type, options) {
        switch (type) {
            case PowerUpType.Shield:
                return new ShieldPowerUp(options);
            case PowerUpType.DoubleJump:
                return new DoubleJumpPowerUp(options);
            case PowerUpType.GravityFlip:
                return new GravityFlipPowerUp(options);
            case PowerUpType.Weapon:
                return new WeaponPowerUp(options);
            default:
                return new ShieldPowerUp(options);
        }
    }
}
