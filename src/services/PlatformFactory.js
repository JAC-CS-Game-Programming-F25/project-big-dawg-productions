import NormalPlatform from '../entities/platforms/NormalPlatform.js';
import BouncyPlatform from '../entities/platforms/BouncyPlatform.js';
import BreakablePlatform from '../entities/platforms/BreakablePlatform.js';
import MovingPlatform from '../entities/platforms/MovingPlatform.js';
import PlatformType from '../enums/PlatformType.js';

export default class PlatformFactory {
    static create(type, options) {
        switch (type) {
            case PlatformType.Bouncy:
                return new BouncyPlatform(options);
            case PlatformType.Breakable:
                return new BreakablePlatform(options);
            case PlatformType.Moving:
                return new MovingPlatform(options);
            case PlatformType.Normal:
            default:
                return new NormalPlatform(options);
        }
    }
}
