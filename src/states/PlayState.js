import BaseState from './BaseState.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS, UI_COLOR, input, KEYS, PLATFORM_SPACING_MIN, SCREEN_WRAP_BUFFER, ENTITY_CLEANUP_DISTANCE, POINTS_PER_PLATFORM } from '../globals.js';
import GameStateName from '../enums/GameStateName.js';
import GameEntity from '../entities/GameEntity.js';
import NormalPlatform from '../entities/platforms/NormalPlatform.js';
import Camera from '../services/Camera.js';
import PlatformGenerator from '../services/PlatformGenerator.js';
import ScoreManager from '../services/ScoreManager.js';
import HUD from '../ui/HUD.js';

export default class PlayState extends BaseState {
	constructor() {
		super();
		this.player = new GameEntity({ x: CANVAS_WIDTH / 2 - 16, y: CANVAS_HEIGHT - 80, width: 32, height: 48 });
		this.playerSpeed = 300;
		this.gravity = 1000;
		this.jumpVelocity = -1050;
		this.onGround = true; // temporary until platforms exist
		this.platforms = [];
		this.camera = new Camera();
		this.generator = new PlatformGenerator();
        this.score = new ScoreManager();
        this.hud = new HUD(this.score);
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
		// spawn player above the first platform so they can land
		this.player.x = CANVAS_WIDTH / 2 - 16;
		this.player.y = baseY - 200;
		// seed generator and ensure a buffer of platforms above
		this.generator.seed(baseY);
		this.generator.generateUntilAbove(this.camera.y, this.platforms);
	}

	update(dt) {
		// Pause toggle
		if (input.isKeyPressed(KEYS.PAUSE)) {
			return stateMachine.change(GameStateName.Pause);
		}

		// horizontal movement
		this.player.ax = 0;
		if (input.isKeyHeld(KEYS.LEFT)) this.player.vx = -this.playerSpeed;
		else if (input.isKeyHeld(KEYS.RIGHT)) this.player.vx = this.playerSpeed;
		else this.player.vx = 0;

		// gravity
		this.player.ay = this.gravity;

        // auto-jump when landing on platform
        let wasOnGround = this.onGround;
        this.onGround = false;		// update physics
		this.player.update(dt);

        // platform collisions (top-only)
        for (const p of this.platforms) {
            if (p.collidesTop(this.player)) {
                p.onLand(this.player);
                this.onGround = true;
                this.score.add(POINTS_PER_PLATFORM);
                
                // auto-jump immediately after landing
                if (!wasOnGround) {
                    this.player.vy = this.jumpVelocity;
                    this.onGround = false;
                }
            }
        }        // update height for scoring
        this.score.updateHeight(this.player.y);

		// horizontal screen wrap
		if (this.player.right < -SCREEN_WRAP_BUFFER) {
			this.player.x = CANVAS_WIDTH + SCREEN_WRAP_BUFFER - this.player.width;
		}
		else if (this.player.left > CANVAS_WIDTH + SCREEN_WRAP_BUFFER) {
			this.player.x = -SCREEN_WRAP_BUFFER;
		}

		// cleanup platforms far below camera
		this.platforms = this.platforms.filter(p => (p.y - this.camera.y) > -ENTITY_CLEANUP_DISTANCE);

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

		// HUD
		this.hud.render(ctx, this.camera.y, this.player.y, CANVAS_HEIGHT - 60);
	}
}
