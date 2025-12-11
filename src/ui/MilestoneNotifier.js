import { CANVAS_WIDTH, UI_COLOR, UI_FONT_SIZE, UI_HIGHLIGHT_COLOR } from '../globals.js';

export default class MilestoneNotifier {
    constructor() {
        this.message = null;
        this.timer = 0;
        this.duration = 3; // total seconds to show
        this.fade = 0.5; // seconds for fade in and fade out
    }

    trigger(milestone) {
        this.message = `${milestone} Milestone Reached!`;
        this.timer = this.duration;
    }

    update(dt) {
        if (this.timer > 0) {
            this.timer = Math.max(0, this.timer - dt);
        }
        if (this.timer === 0) {
            this.message = null;
        }
    }

    render(ctx) {
        if (!this.message || this.timer <= 0) return;
        const t = this.timer;
        const d = this.duration;
        const f = this.fade;
        // Compute alpha: fade in for first f, hold, fade out for last f
        let alpha = 1;
        const elapsed = d - t;
        if (elapsed < f) {
            alpha = Math.min(1, elapsed / f);
        } else if (t < f) {
            alpha = Math.max(0, t / f);
        } else {
            alpha = 1;
        }

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.textAlign = 'center';
        ctx.font = `${UI_FONT_SIZE}px Arial`;
        // Shadow or outline for readability
        ctx.globalAlpha = alpha;
        ctx.fillStyle = UI_HIGHLIGHT_COLOR;
        ctx.fillText(this.message, CANVAS_WIDTH / 2, 30);
        ctx.restore();
    }
}
