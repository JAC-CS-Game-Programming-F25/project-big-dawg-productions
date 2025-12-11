import BaseState from './BaseState.js';
import GameStateName from '../enums/GameStateName.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, UI_COLOR, UI_FONT_SIZE, UI_LARGE_FONT_SIZE, UI_HIGHLIGHT_COLOR, stateMachine, input, KEYS, COLORS, SAVE_KEYS } from '../globals.js';

export default class GameOverState extends BaseState {
    constructor() {
        super();
        this.finalScore = 0;
        this.height = 0;
    }

    enter({ score = 0, height = 0 } = {}) {
        this.finalScore = score;
        this.height = height;

        // Save score to localStorage high scores
        try {
            const raw = localStorage.getItem(SAVE_KEYS.HIGH_SCORES);
            const scores = raw ? JSON.parse(raw) : [];
            scores.push(this.finalScore);
            scores.sort((a, b) => b - a);
            localStorage.setItem(SAVE_KEYS.HIGH_SCORES, JSON.stringify(scores.slice(0, 20)));
        } catch {}
    }

    update(dt) {
        if (input.isKeyPressed(KEYS.ENTER)) {
            stateMachine.change(GameStateName.TitleScreen);
        }
    }

    render(ctx) {
        ctx.fillStyle = COLORS.BACKGROUND_SPACE;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = UI_COLOR;
        ctx.textAlign = 'center';
        ctx.font = `${UI_LARGE_FONT_SIZE}px Arial`;
        ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, 140);

        ctx.font = `${UI_FONT_SIZE}px Arial`;
        ctx.fillText(`Score: ${this.finalScore}`, CANVAS_WIDTH / 2, 220);
        ctx.fillText(`Height: ${Math.floor(this.height)} px`, CANVAS_WIDTH / 2, 260);

        ctx.fillStyle = UI_HIGHLIGHT_COLOR;
        ctx.fillText('Press Enter to go back to Main Menu', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 80);
    }
}
