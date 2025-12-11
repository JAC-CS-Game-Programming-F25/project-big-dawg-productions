import BaseState from './BaseState.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS, UI_COLOR, input, KEYS, PLATFORM_SPACING_MIN } from '../globals.js';
import GameEntity from '../entities/GameEntity.js';
import NormalPlatform from '../entities/platforms/NormalPlatform.js';
import Camera from '../services/Camera.js';
import PlatformGenerator from '../services/PlatformGenerator.js';

export default class PlayState extends BaseState {
	constructor() {
		super();
		this.player = new GameEntity({ x: CANVAS_WIDTH / 2 - 16, y: CANVAS_HEIGHT - 80, width: 32, height: 48 });
		this.playerSpeed = 300;
		this.gravity = 1000;
		this.jumpVelocity = -450;
		this.onGround = true; // temporary until platforms exist
		this.platforms = [];
		this.camera = new Camera();
		this.generator = new PlatformGenerator();
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
		// seed generator and ensure a buffer of platforms above
		this.generator.seed(baseY);
		this.generator.generateUntilAbove(this.camera.y, this.platforms);
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

		// update camera to follow player upwards only
		this.camera.follow(this.player, dt);

		// generate more platforms above camera when needed
		this.generator.generateUntilAbove(this.camera.y, this.platforms);
	}

	render(ctx) {
		// clear background
		ctx.fillStyle = COLORS.BACKGROUND_SPACE;
		ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		// render platforms (convert world Y to screen Y)
		ctx.save();
		ctx.translate(0, -this.camera.y);
		for (const p of this.platforms) {
			p.render(ctx);
		}

		// player
		this.player.render(ctx);
		ctx.restore();

		// HUD placeholder
		ctx.fillStyle = UI_COLOR;
		ctx.font = '16px Arial';
		ctx.fillText('PlayState: Arrow keys to move, Space to jump', 20, 30);
	}
}
