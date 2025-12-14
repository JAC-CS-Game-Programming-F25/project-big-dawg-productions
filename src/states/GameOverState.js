import BaseState from './BaseState.js';
import GameStateName from '../enums/GameStateName.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, UI_COLOR, UI_FONT_SIZE, UI_LARGE_FONT_SIZE, UI_HIGHLIGHT_COLOR, stateMachine, input, KEYS, COLORS, SAVE_KEYS } from '../globals.js';

export default class GameOverState extends BaseState {
    constructor() {
        super();
        this.finalScore = 0;
        this.height = 0;
        this.selectedOption = 0;
        this.menuOptions = [
            { text: 'RETRY', action: () => stateMachine.change(GameStateName.Play) },
            { text: 'MAIN MENU', action: () => stateMachine.change(GameStateName.TitleScreen) },
            { text: 'VIEW SCORES', action: () => stateMachine.change(GameStateName.HighScore) }
        ];
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
        // Navigate menu
        if (input.isKeyPressed(KEYS.UP)) {
            this.selectedOption = (this.selectedOption - 1 + this.menuOptions.length) % this.menuOptions.length;
        }
        else if (input.isKeyPressed(KEYS.DOWN)) {
            this.selectedOption = (this.selectedOption + 1) % this.menuOptions.length;
        }

        // Select option
        if (input.isKeyPressed(KEYS.ENTER)) {
            this.menuOptions[this.selectedOption].action();
        }
    }

    render(ctx) {
        ctx.fillStyle = COLORS.BACKGROUND_SPACE;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = UI_COLOR;
        ctx.textAlign = 'center';
        ctx.font = `${UI_LARGE_FONT_SIZE}px Arial`;
        // Move title higher
        ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, 110);

        ctx.font = `${UI_FONT_SIZE}px Arial`;
        // Move metrics higher
        const scoreY = 180;
        const heightY = 220;
        ctx.fillText(`Score: ${this.finalScore}`, CANVAS_WIDTH / 2, scoreY);
        ctx.fillText(`Height: ${Math.floor(this.height)} px`, CANVAS_WIDTH / 2, heightY);

        // Menu options
        // Restore menu start closer to middle
        const menuStartY = CANVAS_HEIGHT / 2 + 20;
        const menuSpacing = 50;
        this.menuOptions.forEach((option, index) => {
            const y = menuStartY + (index * menuSpacing);
            const isSelected = index === this.selectedOption;
            if (isSelected) {
                ctx.fillStyle = UI_HIGHLIGHT_COLOR;
                ctx.fillRect(CANVAS_WIDTH / 2 - 140, y - 22, 280, 38);
            }
            ctx.fillStyle = isSelected ? COLORS.BACKGROUND_SPACE : UI_COLOR;
            ctx.fillText(option.text, CANVAS_WIDTH / 2, y);
        });

        ctx.fillStyle = UI_COLOR;
        ctx.fillText('Use ↑↓ to navigate, Enter to select', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 60);
    }
}
