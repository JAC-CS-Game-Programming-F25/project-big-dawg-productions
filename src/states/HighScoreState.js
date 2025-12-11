import BaseState from './BaseState.js';
import GameStateName from '../enums/GameStateName.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, UI_COLOR, UI_FONT_SIZE, stateMachine, input, KEYS, COLORS, SAVE_KEYS } from '../globals.js';

export default class HighScoreState extends BaseState {
    constructor() {
        super();
        this.scores = [];
    }

    enter() {
        const raw = localStorage.getItem(SAVE_KEYS.HIGH_SCORES);
        this.scores = raw ? JSON.parse(raw) : [];
    }

    update(dt) {
        if (input.isKeyPressed(KEYS.ESCAPE) || input.isKeyPressed(KEYS.ENTER)) {
            stateMachine.change(GameStateName.TitleScreen);
        }
    }

    render(ctx) {
        ctx.fillStyle = COLORS.BACKGROUND_SPACE;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = UI_COLOR;
        ctx.textAlign = 'center';
        ctx.font = `${UI_FONT_SIZE * 1.2}px Arial`;
        ctx.fillText('High Scores', CANVAS_WIDTH / 2, 120);

        ctx.font = `${UI_FONT_SIZE}px Arial`;
        if (this.scores.length === 0) {
            ctx.fillText('No scores yet.', CANVAS_WIDTH / 2, 200);
        } else {
            this.scores.slice(0, 10).forEach((s, i) => {
                ctx.fillText(`${i + 1}. ${s}`, CANVAS_WIDTH / 2, 200 + i * 30);
            });
        }

        ctx.fillText('Press Enter or Escape to return.', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 60);
    }
}