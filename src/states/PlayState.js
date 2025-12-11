import BaseState from './BaseState.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS, UI_COLOR, input, KEYS, PLATFORM_SPACING_MIN } from '../globals.js';
import GameEntity from '../entities/GameEntity.js';
import NormalPlatform from '../entities/platforms/NormalPlatform.js';

export default class PlayState extends BaseState {
	constructor() {
		super();
		this.player = new GameEntity({ x: CANVAS_WIDTH / 2 - 16, y: CANVAS_HEIGHT - 80, width: 32, height: 48 });
		this.playerSpeed = 300;
		this.gravity = 1000;
		this.jumpVelocity = -450;
		this.onGround = true; // temporary until platforms exist
		this.platforms = [];
	}

	enter() {
		// seed some starting platforms
		const baseY = CANVAS_HEIGHT - 60;
		this.platforms = [
			new NormalPlatform({ x: CANVAS_WIDTH/2 - 80, y: baseY, width: 160, height: 12 }),
			new NormalPlatform({ x: 120, y: baseY - PLATFORM_SPACING_MIN, width: 120, height: 12 }),
			new NormalPlatform({ x: CANVAS_WIDTH - 260, y: baseY - PLATFORM_SPACING_MIN*2, width: 140, height: 12 }),
		];
		this.onGround = false;
	}

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

		// update physics
		this.player.update(dt);

		// platform collisions (top-only)
		for (const p of this.platforms) {
			if (p.collidesTop(this.player)) {
				p.onLand(this.player);
				this.onGround = true;
			}
		}
	}

	render(ctx) {
		// clear background
		ctx.fillStyle = COLORS.BACKGROUND_SPACE;
		ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		// render platforms
		for (const p of this.platforms) {
			p.render(ctx);
		}

		// player
		this.player.render(ctx);

		// HUD placeholder
		ctx.fillStyle = UI_COLOR;
		ctx.font = '16px Arial';
		ctx.fillText('PlayState: Arrow keys to move, Space to jump', 20, 30);
	}
}
