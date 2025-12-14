import Vector from '../../lib/Vector.js';

export default class GameObject {
	constructor({ x = 0, y = 0, width = 0, height = 0, sprites = [], sprite = null } = {}) {
		// Core composition per architecture: position and dimensions as Vectors
		this.position = new Vector(x, y);
		this.dimensions = new Vector(width, height);
		// Maintain scalar mirrors for existing code
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		// Sprites collection and current sprite adapter
		this.sprites = sprites;
		this.sprite = sprite;
		this.isAlive = true;
	}

	get left() { return this.x; }
	get right() { return this.x + this.width; }
	get top() { return this.y; }
	get bottom() { return this.y + this.height; }

	intersects(other) {
		return (
			this.left < other.right &&
			this.right > other.left &&
			this.top < other.bottom &&
			this.bottom > other.top
		);
	}

	update(dt) {
		// override in subclasses
	}

	render(ctx) {
		if (this.sprite && this.sprite.render) {
			this.sprite.render(ctx, this.x, this.y);
		} else {
			// simple placeholder rectangle
			ctx.fillStyle = '#888888';
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
		// Keep vectors in sync with scalars in case external code changed them
		this.position.set(this.x, this.y);
		this.dimensions.set(this.width, this.height);
	}
}
