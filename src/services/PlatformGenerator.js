import PlatformFactory from './PlatformFactory.js';
import { CANVAS_WIDTH, PLATFORM_SPACING_MIN, PLATFORM_SPACING_MAX } from '../globals.js';

export default class PlatformGenerator {
    constructor(random = Math.random) {
        this.rng = random;
        this.lastY = null;
    }

    seed(initialY) {
        this.lastY = initialY;
    }

    nextPlatformY() {
        const spacing = PLATFORM_SPACING_MIN + (PLATFORM_SPACING_MAX - PLATFORM_SPACING_MIN) * this.rng();
        this.lastY -= spacing;
        return this.lastY;
    }

    createPlatform(y) {
        const width = 100 + 80 * this.rng();
        const x = (CANVAS_WIDTH - width) * this.rng();
        // Type selection probabilities
        const r = this.rng();
        let type = 'normal';
        if (r < 0.1) type = 'bouncy';
        else if (r < 0.18) type = 'breakable';
        return PlatformFactory.create(type, { x, y, width, height: 12 });
    }

    generateUntilAbove(cameraTop, platforms) {
        // Ensure there are platforms up to one screen above camera
        while (this.lastY === null || this.lastY > cameraTop - CANVAS_WIDTH) {
            const y = this.nextPlatformY();
            platforms.push(this.createPlatform(y));
        }
    }
}