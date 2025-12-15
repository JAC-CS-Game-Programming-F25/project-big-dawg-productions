import BaseState from './BaseState.js';
import GameStateName from '../enums/GameStateName.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, UI_COLOR, UI_LARGE_FONT_SIZE, UI_FONT_SIZE, UI_HIGHLIGHT_COLOR, UI_FONT_FAMILY, stateMachine, input, KEYS, COLORS } from '../globals.js';

export default class PauseState extends BaseState {
    constructor() {
        super();
        this.resumeHintPulse = 0;
        this.selectedOption = 0;
        this.playState = null; // reference to current PlayState for background render
        this.menuOptions = [
            { text: 'RESUME', action: () => this.resume() },
            { text: 'QUIT TO MENU', action: () => this.quitToMenu() }
        ];
    }

    enter(params = {}) {
        this.resumeHintPulse = 0;
        this.selectedOption = 0;
        this.playState = params.playState ?? null;
    }

    update(dt) {
        this.resumeHintPulse += dt;

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

        // Quick resume with P
        if (input.isKeyPressed(KEYS.PAUSE)) {
            this.resume();
        }
    }

    render(ctx) {
        // Render the game behind the pause menu if available
        if (this.playState && this.playState.render) {
            this.playState.render(ctx);
        }

        // Dim the background with overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Title
        ctx.fillStyle = UI_COLOR;
        ctx.textAlign = 'center';
        ctx.font = `${UI_LARGE_FONT_SIZE}px ${UI_FONT_FAMILY}`;
        ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 80);

        // Menu options
        const menuStartY = CANVAS_HEIGHT / 2 - 20;
        const menuSpacing = 50;

        this.menuOptions.forEach((option, index) => {
            const y = menuStartY + (index * menuSpacing);
            const isSelected = index === this.selectedOption;

            // Draw selection highlight
            if (isSelected) {
                ctx.fillStyle = UI_HIGHLIGHT_COLOR;
                ctx.fillRect(CANVAS_WIDTH / 2 - 100, y - 20, 200, 35);
            }

            // Draw menu text
            ctx.fillStyle = isSelected ? COLORS.BACKGROUND_SPACE : UI_COLOR;
            ctx.font = `${UI_FONT_SIZE}px ${UI_FONT_FAMILY}`;
            ctx.fillText(option.text, CANVAS_WIDTH / 2, y);
        });

        // Instructions
        ctx.fillStyle = UI_COLOR;
        ctx.font = `${UI_FONT_SIZE * 0.8}px ${UI_FONT_FAMILY}`;
        ctx.fillText('W/S to navigate, Enter to select, P to resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 50);
    }

    resume() {
        stateMachine.change(GameStateName.Play, { resume: true });
    }

    quitToMenu() {
        stateMachine.change(GameStateName.TitleScreen);
    }
}