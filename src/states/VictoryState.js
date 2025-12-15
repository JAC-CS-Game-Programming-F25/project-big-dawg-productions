import BaseState from './BaseState.js';
import GameStateName from '../enums/GameStateName.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, UI_COLOR, UI_FONT_SIZE, UI_LARGE_FONT_SIZE, UI_HIGHLIGHT_COLOR, UI_FONT_FAMILY, SPECIAL_FONT_FAMILY, stateMachine, input, KEYS, COLORS } from '../globals.js';

export default class VictoryState extends BaseState {
	constructor() {
		super();
		this.milestone = 'Milestone';
		this.height = 0;
		this.score = 0;
	}

	enter({ milestone = 'Milestone', height = 0, score = 0 } = {}) {
		this.milestone = milestone;
		this.height = height;
		this.score = score;
	}

	update(dt) {
		if (input.isKeyPressed(KEYS.ENTER)) {
			// Resume the current run instead of restarting
			stateMachine.change(GameStateName.Play, { resume: true });
		}
		// Back to title screen
		if (input.isKeyPressed(KEYS.ESCAPE)) {
			stateMachine.change(GameStateName.TitleScreen);
		}
	}

	render(ctx) {
		ctx.fillStyle = COLORS.BACKGROUND_SPACE;
		ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		ctx.fillStyle = UI_COLOR;
		ctx.textAlign = 'center';
		ctx.font = `${UI_LARGE_FONT_SIZE}px ${SPECIAL_FONT_FAMILY}`;
		ctx.fillText(`${this.milestone} Reached!`, CANVAS_WIDTH / 2, 140);

		ctx.font = `${UI_FONT_SIZE}px ${UI_FONT_FAMILY}`;
		ctx.fillText(`Height: ${Math.floor(this.height)} px`, CANVAS_WIDTH / 2, 220);
		ctx.fillText(`Score: ${this.score}`, CANVAS_WIDTH / 2, 260);

		ctx.fillStyle = UI_HIGHLIGHT_COLOR;
		ctx.fillText('Enter: Continue  |  Esc: Back to Menu', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 80);
	}
}

