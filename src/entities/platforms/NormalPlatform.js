import Platform from './Platform.js';
import { UI_COLOR } from '../../globals.js';

export default class NormalPlatform extends Platform {
    constructor(config = {}) {
        super({ ...config, type: 'normal' });
    }

    render(ctx) {
        // placeholder visual until sprites wired
        ctx.fillStyle = UI_COLOR;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}