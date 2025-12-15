import GameObject from '../objects/GameObject.js';
import Vector from '../../lib/Vector.js';
import StateMachine from '../../lib/StateMachine.js';

export default class GameEntity extends GameObject {
	constructor({ x = 0, y = 0, width = 0, height = 0, sprite = null, health = 1, direction = 1 } = {}) {
		super({ x, y, width, height, sprite });
		// Vectors per architecture
		this.velocity = new Vector(0, 0);
		this.acceleration = new Vector(0, 0);
		// Scalar mirrors for compatibility
		this.vx = 0;
		this.vy = 0;
		this.ax = 0;
		this.ay = 0;
		this.friction = 0;
		this.maxSpeedX = Infinity;
		this.maxSpeedY = Infinity;
		// Additional attributes
		this.health = health;
		this.direction = direction;
		this.stateMachine = new StateMachine();
	}

	applyPhysics(dt) {
		// Sync vectors from current scalar intent (external code may set vx/vy/ax/ay directly)
		this.velocity.set(this.vx, this.vy);
		this.acceleration.set(this.ax, this.ay);
		// Accumulate acceleration into velocity
		this.velocity.add(this.acceleration, dt);
		// Reflect back into scalars for downstream logic
		this.vx = this.velocity.x;
		this.vy = this.velocity.y;

		if (this.friction !== 0) {
			const sign = Math.sign(this.vx);
			const mag = Math.max(0, Math.abs(this.vx) - this.friction * dt);
			this.vx = sign * mag;
		}

		// clamp speeds
		if (Math.abs(this.vx) > this.maxSpeedX) this.vx = this.maxSpeedX * Math.sign(this.vx);
		if (Math.abs(this.vy) > this.maxSpeedY) this.vy = this.maxSpeedY * Math.sign(this.vy);

		// Move
		this.x += this.vx * dt;
		this.y += this.vy * dt;

		// Sync vectors from scalars after movement
		this.velocity.set(this.vx, this.vy);
		this.position.set(this.x, this.y);
	}

	update(dt) {
		this.applyPhysics(dt);
	}
}
