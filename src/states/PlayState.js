import BaseState from './BaseState.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS, UI_COLOR, input, KEYS, PLATFORM_SPACING_MIN, SCREEN_WRAP_BUFFER, ENTITY_CLEANUP_DISTANCE, POINTS_PER_PLATFORM, POINTS_PER_ENEMY_KILL, BRONZE_HEIGHT, SILVER_HEIGHT, GOLD_HEIGHT, stateMachine } from '../globals.js';
import GameStateName from '../enums/GameStateName.js';
import GameEntity from '../entities/GameEntity.js';
import Projectile from '../entities/Projectile.js';
import NormalPlatform from '../entities/platforms/NormalPlatform.js';
import BouncyPlatform from '../entities/platforms/BouncyPlatform.js';
import BreakablePlatform from '../entities/platforms/BreakablePlatform.js';
import Camera from '../services/Camera.js';
import PlatformGenerator from '../services/PlatformGenerator.js';
import EnemyFactory from '../services/EnemyFactory.js';
import PowerUpFactory from '../services/PowerUpFactory.js';
import ScoreManager from '../services/ScoreManager.js';
import HUD from '../ui/HUD.js';
import MilestoneNotifier from '../ui/MilestoneNotifier.js';

export default class PlayState extends BaseState {
	constructor() {
		super();
		this.player = new GameEntity({ x: CANVAS_WIDTH / 2 - 16, y: CANVAS_HEIGHT - 80, width: 32, height: 48 });
		this.playerSpeed = 300;
		this.gravity = 1000;
		this.jumpVelocity = -1050;
		this.onGround = true; // temporary until platforms exist
		this.platforms = [];
		this.enemies = [];
		this.powerUps = [];
		this.projectiles = [];
		this.playerShieldActive = false;
		this.playerInvulnerableTimer = 0; // seconds of post-hit immunity
		this.doubleJumpTimer = 0; // seconds double jump is available
		this.canDoubleJump = false; // whether a mid-air jump is available right now
		this.gravityFlipTimer = 0; // seconds gravity is flipped
		this.gravityFlipped = false;
		this.weaponTimer = 0; // seconds shooting is enabled
		this.canShoot = false;
		this.camera = new Camera();
		this.generator = new PlatformGenerator();
		this.score = new ScoreManager();
		this.hud = new HUD(this.score);
		this.notifier = new MilestoneNotifier();
		this.milestonesShown = { Bronze: false, Silver: false, Gold: false };
		this.lastEnemySpawnY = null;
	}

	enter(options = {}) {
			const { resume = false } = options;

			if (resume) {
				// Do not reset; simply return to gameplay as-is
				return;
			}
			// reset milestone tracking
			this.milestonesShown = { Bronze: false, Silver: false, Gold: false };
			// reset enemy spawning + clear existing enemies
			this.enemies = [];
			this.lastEnemySpawnY = null;
			// reset power-ups and all effect flags/timers
			this.powerUps = [];
			this.projectiles = [];
			this.lastPowerUpSpawnY = null;
			this.playerShieldActive = false;
			this.playerInvulnerableTimer = 0;
			this.doubleJumpTimer = 0;
			this.canDoubleJump = false;
			this.gravityFlipTimer = 0;
			this.gravityFlipped = false;
			this.weaponTimer = 0;
			this.canShoot = false;
			// reset player physics
		this.player.vx = 0;
		this.player.vy = 0;
		this.player.ax = 0;
		this.player.ay = 0;

		// reset score and HUD
		this.score.reset();

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
		
		// reset camera to follow from player start position
		this.camera.y = this.player.y - CANVAS_HEIGHT / 2;
		
		// seed generator and ensure a buffer of platforms above
		this.generator.seed(baseY);
		this.generator.generateUntilAbove(this.camera.y, this.platforms);

		// enemies are gated by milestones; do not spawn at start

		// initialize spawn tracking
		this.lastEnemySpawnY = baseY;
		this.lastPowerUpSpawnY = baseY;
	}

	spawnInitialEnemies(baseY) {
		// attach a ground enemy to the first platform so it rides with it
		const platform = this.platforms[0];
		if (platform && !(platform instanceof BreakablePlatform)) {
			const offsetX = Math.min(Math.max(10, (platform.width - 32) / 2), platform.width - 32 - 10);
			this.enemies.push(EnemyFactory.create('ground', { platform, offsetX, width: 32, height: 24 }));
		}
		// one flying enemy above
		this.enemies.push(EnemyFactory.create('flying', { x: CANVAS_WIDTH / 2 - 14, y: baseY - 220, width: 28, height: 20, speed: 120 }));
	}

	update(dt) {
		// Pause toggle
		if (input.isKeyPressed(KEYS.PAUSE)) {
			return stateMachine.change(GameStateName.Pause, { playState: this });
		}

		// horizontal movement
		this.player.ax = 0;
		if (input.isKeyHeld(KEYS.LEFT)) this.player.vx = -this.playerSpeed;
		else if (input.isKeyHeld(KEYS.RIGHT)) this.player.vx = this.playerSpeed;
		else this.player.vx = 0;

		// manual double-jump input while airborne
		if (input.isKeyPressed(KEYS.JUMP)) {
			if (!this.onGround && this.doubleJumpTimer > 0 && this.canDoubleJump) {
				this.player.vy = this.jumpVelocity;
				this.canDoubleJump = false; // consume until next landing while timer remains
			}
		}

		// shooting input
		if (input.isKeyPressed(KEYS.SHOOT) && this.canShoot) {
			const dirY = -1; // shoot upward relative to screen
			const speed = 700;
			this.projectiles.push(new Projectile({ x: this.player.x + this.player.width/2 - 3, y: this.player.y, width: 6, height: 10, vx: 0, vy: dirY * speed }));
		}

		// gravity (quarter strength when flipped for easier control)
		this.player.ay = this.gravityFlipped ? -(Math.abs(this.gravity) * 0.25) : Math.abs(this.gravity);

		// tick down post-hit immunity; when it ends, stop the character
		if (this.playerInvulnerableTimer > 0) {
			const prev = this.playerInvulnerableTimer;
			this.playerInvulnerableTimer = Math.max(0, this.playerInvulnerableTimer - dt);
			if (prev > 0 && this.playerInvulnerableTimer === 0) {
				// Drastically slow the character instead of full stop
				this.player.vx *= 0.1;
				this.player.vy *= 0.1;
				this.player.ax = 0;
				// restore normal gravity immediately after slowdown
				this.player.ay = this.gravityFlipped ? -Math.abs(this.gravity) : Math.abs(this.gravity);
			}
		}

        // auto-jump when landing on platform
        let wasOnGround = this.onGround;
        this.onGround = false;		// update physics
		this.player.update(dt);

		// update enemies
		for (const e of this.enemies) {
			e.update(dt);
		}

		// update power-ups; if attached to moving platform, follow it
		for (const pu of this.powerUps) {
			if (pu.attachPlatform) {
				pu.x = pu.attachPlatform.x + (pu.attachOffsetX || 0);
				pu.y = pu.attachPlatform.y - pu.height;
			}
		}

		// update projectiles
		for (const b of this.projectiles) {
			b.update(dt);
		}

		// despawn enemies that have fallen below the bottom of the screen or are dead
		this.enemies = this.enemies.filter(e => e.isAlive && e.y <= this.camera.y + CANVAS_HEIGHT + 200);

		// collect power-ups and cleanup off-screen
		for (const pu of this.powerUps) {
			if (this.player.intersects(pu)) {
				pu.applyTo(this.player, this);
			}
		}
		this.powerUps = this.powerUps.filter(pu => pu.isAlive && pu.y <= this.camera.y + CANVAS_HEIGHT + 200);
		// despawn projectiles off-screen
		this.projectiles = this.projectiles.filter(b => b.y >= this.camera.y - 100 && b.y <= this.camera.y + CANVAS_HEIGHT + 100);

        // platform collisions (top-only)
		for (const p of this.platforms) {
            if (p.collidesTop(this.player)) {
                p.onLand(this.player);
				this.onGround = true;
                this.score.add(POINTS_PER_PLATFORM);
                
                // auto-jump immediately after landing
				if (!wasOnGround) {
					// If this is a bouncy platform, skip normal auto-jump;
					// the platform's onLand already set a strong bounce.
					if (p instanceof BouncyPlatform) {
						// bouncy platforms handle their own strong bounce
						this.onGround = false;
					} else if (p instanceof BreakablePlatform) {
						// smaller hop off breakable platforms
						this.player.vy = this.jumpVelocity * 0.65;
						this.onGround = false;
					} else {
						// normal auto-jump
						this.player.vy = this.jumpVelocity;
						this.onGround = false;
					}
					// refresh double-jump availability upon leaving ground if active
					if (this.doubleJumpTimer > 0) {
						this.canDoubleJump = true;
					}
				}
            }
		}
		// update height for scoring
		this.score.updateHeight(this.player.y);
		// victory milestones (one-time trigger per run)
		const baseY = CANVAS_HEIGHT - 60;
		const height = this.score.getHeightAchieved(baseY);
		if (height >= GOLD_HEIGHT && !this.milestonesShown.Gold) {
			this.milestonesShown.Gold = true;
			this.hud.currentMilestone = 'Gold';
			this.notifier.trigger('Gold');
		} else if (height >= SILVER_HEIGHT && !this.milestonesShown.Silver) {
			this.milestonesShown.Silver = true;
			this.hud.currentMilestone = 'Silver';
			this.notifier.trigger('Silver');
		} else if (height >= BRONZE_HEIGHT && !this.milestonesShown.Bronze) {
			this.milestonesShown.Bronze = true;
			this.hud.currentMilestone = 'Bronze';
			this.notifier.trigger('Bronze');
		}

		// horizontal screen wrap
		if (this.player.right < -SCREEN_WRAP_BUFFER) {
			this.player.x = CANVAS_WIDTH + SCREEN_WRAP_BUFFER - this.player.width;
		}
		else if (this.player.left > CANVAS_WIDTH + SCREEN_WRAP_BUFFER) {
			this.player.x = -SCREEN_WRAP_BUFFER;
		}

		// cleanup platforms far below camera
		for (const p of this.platforms) {
			if (typeof p.update === 'function') {
				p.update(1/60);
			}
		}
		// cleanup platforms far below camera or marked dead
		this.platforms = this.platforms.filter(p => p.isAlive && (p.y - this.camera.y) > -ENTITY_CLEANUP_DISTANCE);

		// update camera to follow player upwards only
		this.camera.follow(this.player, dt);
		// update notifier
		this.notifier.update(dt);

		// tick down double-jump timer
		if (this.doubleJumpTimer > 0) {
			this.doubleJumpTimer = Math.max(0, this.doubleJumpTimer - dt);
			// when timer ends, disable any remaining double jump
			if (this.doubleJumpTimer === 0) this.canDoubleJump = false;
		}

		// tick down gravity flip timer
		if (this.gravityFlipTimer > 0) {
			this.gravityFlipTimer = Math.max(0, this.gravityFlipTimer - dt);
			if (this.gravityFlipTimer === 0) {
				this.gravityFlipped = false;
			}
		}

		// tick down weapon timer
		if (this.weaponTimer > 0) {
			this.weaponTimer = Math.max(0, this.weaponTimer - dt);
			this.canShoot = this.weaponTimer > 0;
		}

		// enemy collisions: touching enemy ends the run
		for (const e of this.enemies) {
			if (this.player.intersects(e)) {
				// ignore collisions while invulnerable
				if (this.playerInvulnerableTimer > 0) {
					continue;
				}
				if (this.playerShieldActive) {
					// consume shield and grant 2s immunity
					this.playerShieldActive = false;
					this.playerInvulnerableTimer = 2.0;
					continue;
				}
				const baseY2 = CANVAS_HEIGHT - 60;
				const height2 = this.score.getHeightAchieved(baseY2);
				return stateMachine.change(GameStateName.GameOver, { score: this.score.score, height: height2 });
			}
		}

		// projectile vs enemy collisions
		for (const b of this.projectiles) {
			for (const e of this.enemies) {
				if (b.isAlive && e.isAlive && b.intersects(e)) {
					b.isAlive = false;
					e.isAlive = false;
					this.score.add(POINTS_PER_ENEMY_KILL);
				}
			}
		}
		this.projectiles = this.projectiles.filter(b => b.isAlive);
		this.enemies = this.enemies.filter(e => e.isAlive);

		// generate more platforms above camera when needed
		this.generator.generateUntilAbove(this.camera.y, this.platforms);

		// spawn enemies throughout the game above the camera for testing
		this.spawnEnemiesUntilAbove(this.camera.y);

		// spawn power-ups periodically above the camera
		this.spawnPowerUpsUntilAbove(this.camera.y);

		// check for game over when player fully off-screen below
		if (this.player.top > this.camera.y + CANVAS_HEIGHT) {
			const baseY = CANVAS_HEIGHT - 60;
			const height = this.score.getHeightAchieved(baseY);
			stateMachine.change(GameStateName.GameOver, { score: this.score.score, height });
		}
	}

	spawnEnemiesUntilAbove(cameraY) {
		// Ensure enemies are spawned up to one screen above the camera
		const targetY = cameraY - CANVAS_HEIGHT; // one screen above
		if (this.lastEnemySpawnY === null) this.lastEnemySpawnY = cameraY + CANVAS_HEIGHT;
		while (this.lastEnemySpawnY > targetY) {
			// move upward by a random band
			const band = 180 + 120 * Math.random();
			this.lastEnemySpawnY -= band;
			// choose type randomly but gate by milestones
			const r = Math.random();
			let type = null;
			for (let i = 0; i < 3 && !type; i++) {
				const pick = (Math.random() < 0.5) ? 'flying' : 'ground';
				if (pick === 'flying' && this.milestonesShown.Bronze) type = 'flying';
				if (pick === 'ground' && this.milestonesShown.Silver) type = 'ground';
			}
			if (!type) {
				// No unlocked enemy types yet; stop spawning
				break;
			}
			// place within screen width
			const w = type === 'ground' ? 32 : 28;
			const h = type === 'ground' ? 24 : 20;
			if (type === 'ground') {
				// Attach ground enemy to a nearby platform at similar Y
				let closest = null;
				let bestDy = Infinity;
				for (const p of this.platforms) {
					const dy = Math.abs(p.y - this.lastEnemySpawnY);
					if (dy < bestDy && !(p instanceof BreakablePlatform)) { bestDy = dy; closest = p; }
				}
				if (closest) {
					const offsetX = Math.random() * Math.max(0, closest.width - w);
					this.enemies.push(EnemyFactory.create('ground', { platform: closest, offsetX, width: w, height: h }));
				}
			} else {
				const x = Math.max(0, Math.min(CANVAS_WIDTH - w, Math.random() * (CANVAS_WIDTH - w)));
				this.enemies.push(EnemyFactory.create('flying', { x, y: this.lastEnemySpawnY, width: w, height: h }));
			}
		}
	}

	spawnPowerUpsUntilAbove(cameraY) {
		// Spawn with a 5% chance per platform within one screen above the camera
		const topBound = cameraY - CANVAS_HEIGHT;
		const bottomBound = this.lastPowerUpSpawnY ?? (cameraY + CANVAS_HEIGHT);
		const w = 24, h = 24;
		for (const p of this.platforms) {
			if (p.y <= bottomBound && p.y >= topBound) {
				if (Math.random() < 0.05) {
					// avoid spawning a power-up on a platform that has a ground enemy
					const hasGroundEnemy = this.enemies.some(e => e.platform === p && e.isAlive);
					if (hasGroundEnemy) continue;
					const offsetX = Math.random() * Math.max(0, p.width - w);
					const x = p.x + offsetX;
					const y = p.y - h;
					// randomly choose a power-up type (shield, double jump, gravity flip, weapon)
					const r = Math.random();
					let type = 'shield';
					if (r < 0.25) type = 'shield';
					else if (r < 0.5) type = 'doubleJump';
					else if (r < 0.75) type = 'gravityFlip';
					else type = 'weapon';
					const pu = PowerUpFactory.create(type, { x, y, width: w, height: h });
					// attach to platform so it moves with it
					pu.attachPlatform = p;
					pu.attachOffsetX = offsetX;
					this.powerUps.push(pu);
				}
			}
		}
		// advance the last considered band so we don't resample same region repeatedly
		this.lastPowerUpSpawnY = topBound;
	}

	render(ctx) {
		// clear background
		ctx.fillStyle = COLORS.BACKGROUND_SPACE;
		ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		// render world (optionally visually flipped during gravity flip)
		ctx.save();
		if (this.gravityFlipped) {
			// Flip the screen vertically for a strong visual effect
			ctx.translate(0, CANVAS_HEIGHT);
			ctx.scale(1, -1);
		}
		// convert world Y to screen Y by translating camera
		ctx.translate(0, -this.camera.y);
		for (const p of this.platforms) {
			p.render(ctx);
		}

		// power-ups
		for (const pu of this.powerUps) {
			pu.render(ctx);
		}

		// enemies
		for (const e of this.enemies) {
			e.render(ctx);
		}

		// projectiles
		for (const b of this.projectiles) {
			b.render(ctx);
		}

		// player
		this.player.render(ctx);
		ctx.restore();

		// optional subtle overlay while flipped
		if (this.gravityFlipped) {
			ctx.save();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.fillStyle = 'rgba(155, 89, 182, 0.15)'; // light purple tint
			ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
			ctx.restore();
		}

		// HUD
		this.hud.render(ctx, this.camera.y, this.player.y, CANVAS_HEIGHT - 60, { immunitySeconds: this.playerInvulnerableTimer, shieldReady: this.playerShieldActive, weaponSeconds: this.weaponTimer });
		// Milestone notification banner
		this.notifier.render(ctx);
		
		// Add controls hint in fixed position
		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.fillStyle = UI_COLOR;
		ctx.font = '14px Arial';
		ctx.fillText('A/D to move, P to pause', 120, CANVAS_HEIGHT - 20);
		ctx.restore();
	}
}
