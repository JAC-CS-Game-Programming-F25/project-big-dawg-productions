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
        if (r < 0.08) type = 'bouncy';
        else if (r < 0.16) type = 'breakable';
        else if (r < 0.24) type = 'moving';
        // Moving platforms get a default speed/range tuned to width
        const options = { x, y, width, height: 12 };
        if (type === 'moving') {
            options.speed = 60 + 60 * this.rng();
            options.range = 80 + 80 * this.rng();
        }
        return PlatformFactory.create(type, options);
    }

    generateUntilAbove(cameraTop, platforms) {
        // Ensure there are platforms up to one screen above camera
        while (this.lastY === null || this.lastY > cameraTop - CANVAS_WIDTH) {
            const y = this.nextPlatformY();
            platforms.push(this.createPlatform(y));
        }
    }
}