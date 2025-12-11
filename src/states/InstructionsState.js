import BaseState from './BaseState.js';
import GameStateName from '../enums/GameStateName.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, UI_COLOR, UI_FONT_SIZE, stateMachine, input, KEYS, COLORS } from '../globals.js';

export default class InstructionsState extends BaseState {
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
        ctx.fillText('Instructions', CANVAS_WIDTH / 2, 120);

        ctx.font = `${UI_FONT_SIZE}px Arial`;
        const lines = [
            'Left/Right: Move',
            'Space: Jump',
            'P: Pause',
            'Reach higher platforms to increase your score.',
            'Press Enter or Escape to return.'
        ];

        lines.forEach((l, i) => {
            ctx.fillText(l, CANVAS_WIDTH / 2, 200 + i * 40);
        });
    }
}