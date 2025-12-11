import GameObject from '../objects/GameObject.js';

export default class GameEntity extends GameObject {
	constructor({ x = 0, y = 0, width = 0, height = 0, sprite = null } = {}) {
		super({ x, y, width, height, sprite });
		this.vx = 0;
		this.vy = 0;
		this.ax = 0;
		this.ay = 0;
		this.friction = 0;
		this.maxSpeedX = Infinity;
		this.maxSpeedY = Infinity;
	}

	applyPhysics(dt) {
		this.vx += this.ax * dt;
		this.vy += this.ay * dt;

		if (this.friction !== 0) {
			const sign = Math.sign(this.vx);
			const mag = Math.max(0, Math.abs(this.vx) - this.friction * dt);
			this.vx = sign * mag;
		}

		// clamp speeds
		if (Math.abs(this.vx) > this.maxSpeedX) this.vx = this.maxSpeedX * Math.sign(this.vx);
		if (Math.abs(this.vy) > this.maxSpeedY) this.vy = this.maxSpeedY * Math.sign(this.vy);

		this.x += this.vx * dt;
		this.y += this.vy * dt;
	}

	update(dt) {
		this.applyPhysics(dt);
	}
}
