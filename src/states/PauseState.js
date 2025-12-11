import BaseState from './BaseState.js';
import GameStateName from '../enums/GameStateName.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, UI_COLOR, UI_LARGE_FONT_SIZE, UI_FONT_SIZE, stateMachine, input, KEYS, COLORS } from '../globals.js';

export default class PauseState extends BaseState {
    constructor() {
        super();
        this.resumeHintPulse = 0;
    }

    enter(params = {}) {
        this.resumeHintPulse = 0;
        // optionally capture a screenshot/frame to darken behind pause (future enhancement)
    }

    update(dt) {
        this.resumeHintPulse += dt;

        // Resume on P or Enter
        if (input.isKeyPressed(KEYS.PAUSE) || input.isKeyPressed(KEYS.ENTER)) {
            stateMachine.change(GameStateName.Play);
        }
    }

    render(ctx) {
        // Dim the background with overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Title
        ctx.fillStyle = UI_COLOR;
        ctx.textAlign = 'center';
        ctx.font = `${UI_LARGE_FONT_SIZE}px Arial`;
        ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);

        // Pulse hint
        const alpha = 0.7 + Math.sin(this.resumeHintPulse * 3) * 0.3;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.font = `${UI_FONT_SIZE}px Arial`;
        ctx.fillText('Press P or Enter to Resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
    }
}