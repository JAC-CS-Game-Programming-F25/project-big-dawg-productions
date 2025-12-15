import BaseState from './BaseState.js';
import GameStateName from '../enums/GameStateName.js';
import { 
	CANVAS_WIDTH, 
	CANVAS_HEIGHT, 
	KEYS, 
	COLORS, 
	UI_LARGE_FONT_SIZE, 
	UI_FONT_SIZE,
	UI_COLOR,
	UI_HIGHLIGHT_COLOR,
	stateMachine,
	input,
	sounds
} from '../globals.js';

/**
 * The main title screen state for Cosmic Hopper.
 * Displays the game logo, main menu options, and handles navigation.
 */
export default class TitleScreenState extends BaseState {
	constructor() {
		super();
		this.selectedOption = 0;
		this.menuOptions = [
			{ text: 'START GAME', action: () => this.startGame() },
			{ text: 'INSTRUCTIONS', action: () => this.showInstructions() },
			{ text: 'HIGH SCORES', action: () => this.showHighScores() }
		];
		this.titleAnimationTime = 0;
		this.keyPressed = false;
	}

	enter(params = {}) {
		this.selectedOption = 0;
		this.titleAnimationTime = 0;
		this.keyPressed = false;
		// prime confirm sound to reduce first-play latency
		try {
			if (sounds && sounds.get && sounds.get('ui_confirm')) {
				// play then immediately pause to decode and cache
				sounds.play('ui_confirm');
				sounds.pause && sounds.pause('ui_confirm');
			}
		} catch {}
	}

	update(dt) {
		this.titleAnimationTime += dt;
		this.handleInput();
	}

	handleInput() {
		// Prevent rapid menu navigation
		if (this.keyPressed) {
			if (!input.isKeyPressed(KEYS.ENTER) && 
				!input.isKeyPressed(KEYS.UP) && 
				!input.isKeyPressed(KEYS.DOWN)) {
				this.keyPressed = false;
			}
			return;
		}

		// Navigate menu up
		if (input.isKeyPressed(KEYS.UP)) {
			this.selectedOption = (this.selectedOption - 1 + this.menuOptions.length) % this.menuOptions.length;
			this.keyPressed = true;
			try { sounds.play('ui_select'); } catch {}
		}
		
		// Navigate menu down
		else if (input.isKeyPressed(KEYS.DOWN)) {
			this.selectedOption = (this.selectedOption + 1) % this.menuOptions.length;
			this.keyPressed = true;
			try { sounds.play('ui_select'); } catch {}
		}
		
		// Select option
		else if (input.isKeyPressed(KEYS.ENTER)) {
			try { sounds.play('ui_confirm'); } catch {}
			this.menuOptions[this.selectedOption].action();
			this.keyPressed = true;
		}
	}

	render(context) {
		// Clear screen with space background
		context.fillStyle = COLORS.BACKGROUND_SPACE;
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		// Draw animated background stars (simple effect)
		this.drawStarField(context);

		// Draw title with pulsing effect
		context.fillStyle = UI_HIGHLIGHT_COLOR;
		context.font = `${UI_LARGE_FONT_SIZE * 1.5}px Arial`;
		context.textAlign = 'center';
		
		const titlePulse = 1 + Math.sin(this.titleAnimationTime * 3) * 0.1;
		context.save();
		context.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3);
		context.scale(titlePulse, titlePulse);
		context.fillText('COSMIC HOPPER', 0, 0);
		context.restore();

		// Draw subtitle
		context.fillStyle = UI_COLOR;
		context.font = `${UI_FONT_SIZE}px Arial`;
		context.fillText('Jump to the Stars!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3 + 60);

		// Draw menu options
		this.drawMenu(context);

		// Draw instructions at bottom
		context.fillStyle = UI_COLOR;
		context.font = `${UI_FONT_SIZE * 0.8}px Arial`;
		context.fillText('Use ↑↓ to navigate, ENTER to select', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 50);
	}

	drawStarField(context) {
		// Simple star field effect
		context.fillStyle = UI_COLOR;
		const starCount = 50;
		
		for (let i = 0; i < starCount; i++) {
			const x = (i * 47 + this.titleAnimationTime * 10) % CANVAS_WIDTH;
			const y = (i * 31) % CANVAS_HEIGHT;
			const size = (i % 3) + 1;
			
			context.fillRect(x, y, size, size);
		}
	}

	drawMenu(context) {
		const menuStartY = CANVAS_HEIGHT / 2 + 50;
		const menuSpacing = 60;

		this.menuOptions.forEach((option, index) => {
			const y = menuStartY + (index * menuSpacing);
			const isSelected = index === this.selectedOption;

			// Draw selection highlight
			if (isSelected) {
				context.fillStyle = UI_HIGHLIGHT_COLOR;
				context.fillRect(CANVAS_WIDTH / 2 - 150, y - 25, 300, 40);
			}

			// Draw menu text
			context.fillStyle = isSelected ? COLORS.BACKGROUND_SPACE : UI_COLOR;
			context.font = `${UI_FONT_SIZE}px Arial`;
			context.textAlign = 'center';
			context.fillText(option.text, CANVAS_WIDTH / 2, y);
		});
	}

	startGame() {
		stateMachine.change(GameStateName.Play);
	}

	showInstructions() {
		stateMachine.change(GameStateName.Instructions);
	}

	showHighScores() {
		stateMachine.change(GameStateName.HighScore);
	}
	
	// Removed inline instructions; use Instructions state from menu instead.
}
