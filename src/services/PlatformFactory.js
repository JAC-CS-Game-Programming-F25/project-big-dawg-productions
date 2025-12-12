import NormalPlatform from '../entities/platforms/NormalPlatform.js';
import BouncyPlatform from '../entities/platforms/BouncyPlatform.js';
import BreakablePlatform from '../entities/platforms/BreakablePlatform.js';
import MovingPlatform from '../entities/platforms/MovingPlatform.js';

export default class PlatformFactory {
    static create(type, options) {
        switch (type) {
            case 'bouncy':
                return new BouncyPlatform(options);
            case 'breakable':
                return new BreakablePlatform(options);
            case 'moving':
                return new MovingPlatform(options);
            case 'normal':
            default:
                return new NormalPlatform(options);
        }
    }
}
