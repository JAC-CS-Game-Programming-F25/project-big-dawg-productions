import GameEntity from './GameEntity.js';
import Animation from '../../lib/Animation.js';
import Projectile from './Projectile.js';
import { ANIMATION_FPS } from '../globals.js';
import JumpingState from '../states/player/JumpingState.js';
import FallingState from '../states/player/FallingState.js';
import ShootingState from '../states/player/ShootingState.js';
import InvincibleState from '../states/player/InvincibleState.js';
import DeadState from '../states/player/DeadState.js';
import IdleState from '../states/player/IdleState.js';

export default class Player extends GameEntity {
    constructor({ x = 0, y = 0, width = 0, height = 0, sprite = null } = {}) {
        super({ x, y, width, height, sprite });
        this.score = 0;
        this.powerups = [];
        // Combat and abilities
        this.canShoot = false;
        this.weaponTimer = 0;
        this.gravityFlipped = false;
        this.gravityFlipTimer = 0;
        this.invulnerableTimer = 0;
        // Animations
        this.jumpAnim = null;
        this.fallAnim = null;
        this.idleRenderer = null;
        this.currentAnim = null;
        // Player state machine setup
        this.stateMachine.add('falling', new FallingState(this));
        this.stateMachine.add('jumping', new JumpingState(this));
        this.stateMachine.add('idle', new IdleState(this));
        this.stateMachine.add('invincible', new InvincibleState(this));
        this.stateMachine.add('shooting', new ShootingState(this));
        this.stateMachine.add('dead', new DeadState(this));
        this.stateMachine.change('falling');
    }

    setAnimations(jumpFrames, fallFrames, idleRenderer = null) {
        this.jumpAnim = new Animation([...Array(jumpFrames.length).keys()], 1 / ANIMATION_FPS.PLAYER_JUMP);
        this.fallAnim = new Animation([...Array(fallFrames.length).keys()], 1 / ANIMATION_FPS.PLAYER_FALL);
        this.idleRenderer = idleRenderer;
        // Wrap renderers to index into the provided frames
        const renderers = { jumpFrames, fallFrames };
        this.sprite = {
            render: (ctx, x, y) => {
                const anim = this.currentAnim || this.jumpAnim;
                const idx = anim.getCurrentFrame();
                const framesArray = anim === this.jumpAnim ? renderers.jumpFrames : renderers.fallFrames;
                framesArray[idx].render(x, y);
            }
        };
        this.currentAnim = this.jumpAnim;
    }

    enableWeapon(duration) {
        this.canShoot = true;
        this.weaponTimer = duration;
    }

    shoot() {
        if (!this.canShoot) return null;
        const speed = 700;
        this.stateMachine.change('shooting');
        return new Projectile({
            x: this.x + this.width / 2 - 3,
            y: this.y,
            width: 6,
            height: 10,
            vx: 0,
            vy: -speed,
            damage: 1
        });
    }

    flipGravity(duration) {
        this.gravityFlipped = true;
        this.gravityFlipTimer = duration;
    }

    enableInvincibility(duration) {
        this.invulnerableTimer = duration;
        this.stateMachine.change('invincible');
    }

    isInvincible() {
        return this.invulnerableTimer > 0;
    }

    onLand() {
        this.stateMachine.change('jumping');
    }

    onHitEnemy() {
        if (!this.isInvincible()) {
            this.stateMachine.change('dead');
        }
    }

    update(dt) {
        // physics
        super.update(dt);

        // timers
        if (this.weaponTimer > 0) {
            this.weaponTimer = Math.max(0, this.weaponTimer - dt);
            this.canShoot = this.weaponTimer > 0;
        }
        if (this.gravityFlipTimer > 0) {
            this.gravityFlipTimer = Math.max(0, this.gravityFlipTimer - dt);
            if (this.gravityFlipTimer === 0) this.gravityFlipped = false;
        }
        if (this.invulnerableTimer > 0) {
            this.invulnerableTimer = Math.max(0, this.invulnerableTimer - dt);
        }

        // Drive player state transitions based on velocity and ground state unless shooting/invincible
        const current = this.stateMachine.getCurrentStateName();
        if (current !== 'shooting' && current !== 'invincible') {
            if (this.isOnGround && Math.abs(this.vy) < 1e-3 && this.idleRenderer) this.stateMachine.change('idle');
            else if (this.vy < 0) this.stateMachine.change('jumping');
            else if (this.vy > 0) this.stateMachine.change('falling');
        }
        // Update current state
        this.stateMachine.update(dt);
        // Advance current animation
        if (this.currentAnim) this.currentAnim.update(dt);
    }
}
