import BaseState from './BaseState.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS, UI_COLOR, input, KEYS } from '../globals.js';
import GameEntity from '../entities/GameEntity.js';

export default class PlayState extends BaseState {
	constructor() {
		super();
		this.player = new GameEntity({ x: CANVAS_WIDTH / 2 - 16, y: CANVAS_HEIGHT - 80, width: 32, height: 48 });
		this.playerSpeed = 300;
		this.gravity = 1000;
		this.jumpVelocity = -450;
		this.onGround = true; // temporary until platforms exist
	}

	enter() {}

	update(dt) {
		// horizontal movement
		this.player.ax = 0;
		if (input.isKeyDown(KEYS.LEFT)) this.player.vx = -this.playerSpeed;
		else if (input.isKeyDown(KEYS.RIGHT)) this.player.vx = this.playerSpeed;
		else this.player.vx = 0;

		// gravity
		this.player.ay = this.gravity;

		// basic jump placeholder
		if (this.onGround && input.isKeyPressed(KEYS.JUMP)) {
			this.player.vy = this.jumpVelocity;
			this.onGround = false;
		}

		// temporary ground collision at bottom of screen
		this.player.update(dt);
		if (this.player.bottom >= CANVAS_HEIGHT - 10) {
			this.player.y = CANVAS_HEIGHT - 10 - this.player.height;
			this.player.vy = 0;
			this.onGround = true;
		}
	}

	render(ctx) {
		// clear background
		ctx.fillStyle = COLORS.BACKGROUND_SPACE;
		ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		// ground line placeholder
		ctx.strokeStyle = UI_COLOR;
		ctx.beginPath();
		ctx.moveTo(0, CANVAS_HEIGHT - 10);
		ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - 10);
		ctx.stroke();

		// player
		this.player.render(ctx);

		// HUD placeholder
		ctx.fillStyle = UI_COLOR;
		ctx.font = '16px Arial';
		ctx.fillText('PlayState: Arrow keys to move, Space to jump', 20, 30);
	}
}
