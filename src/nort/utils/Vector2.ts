interface V {
	x: number;
	y: number;
}

export default class Vector2 {

	public x: number;
	public y: number;

	constructor (x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}


	// Static methods

	static from (vector: V): Vector2 {
		return new Vector2(vector.x, vector.y);
	}

	static fromAngle (angle: number): Vector2 {
		return new Vector2(Math.cos(angle), Math.sin(angle));
	}

	static random (): Vector2 {
		return Vector2.fromAngle(Math.PI * 2 * Math.random());
	}


	// Chainable methods

	public set (vector: V): this {
		this.x = vector.x;
		this.y = vector.y;
		return this;
	}

	public setXY (x: number, y = x): this {
		this.x = x;
		this.y = y;
		return this;
	}


	public add (vector: V): this {
		this.x += vector.x;
		this.y += vector.y;
		return this;
	}

	public addXY (x: number, y = x): this {
		this.x += x;
		this.y += y;
		return this;
	}


	public sub (vector: V): this {
		this.x -= vector.x;
		this.y -= vector.y;
		return this;
	}

	public subXY (x: number, y = x): this {
		this.x -= x;
		this.y -= y;
		return this;
	}


	public scale (vector: V): this {
		this.x *= vector.x;
		this.y *= vector.y;
		return this;
	}

	public scaleN (n: number): this {
		return this.scaleXY(n, n);
	}

	public scaleXY (x: number, y: number): this {
		this.x *= x;
		this.y *= y;
		return this;
	}


	public div (vector: V): this {
		this.x /= vector.x;
		this.y /= vector.y;
		return this;
	}

	public divN (n: number): this {
		return this.divXY(n, n);
	}

	public divXY (x: number, y = x): this {
		this.x /= x;
		this.y /= y;
		return this;
	}


	public rotate (angle: number): this {
		const newAngle = this.angle() + angle;
		this.x = Math.cos(newAngle);
		this.y = Math.sin(newAngle);
		return this;
	}

	public rotateFrom (pos: V, angle: number): this {

		const cos = Math.cos(angle);
		const sin = Math.sin(angle);

		const translated = this.copy().sub(pos);

		const result = new Vector2(
			translated.x * cos - translated.y * sin,
			translated.x * sin + translated.y * cos
		);

		this.set(result.copy().add(pos));

		return this;

	}


	// Methods that return numbers

	public angle (): number {
		return Math.atan2(this.y, this.x);
	}

	public angleTo (vector: V): number {
		return Math.atan2(vector.y - this.y, vector.x - this.x);
	}

	public distance (vector: V): number {
		return Math.hypot(this.x - vector.x, this.y - vector.y);
	}


	// Methods that create new Vectors

	public copy (): Vector2 {
		return Vector2.from(this);
	}

	public get new (): Vector2 {
		return Vector2.from(this);
	}

}
