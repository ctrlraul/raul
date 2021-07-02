import HSLA from "../utils/HSLA";
import randomPointInCircle from "../utils/randomPointInCircle";
import Vector2 from "../utils/Vector2"


export class Particle {

	color: HSLA;
	pos: Vector2;
	vel: Vector2;
	baseSize: number;
	size: number;
	lifespan: number;
	age: number = 0;
	alive: boolean = true;

	constructor (
		color: HSLA,
		pos: Vector2,
		vel: Vector2,
		size: number,
		lifespan: number,
	) {

		this.color = color;
		this.pos = pos;
		this.vel = vel;
		this.baseSize = size;
		this.size = size;
		this.lifespan = lifespan;

	}
}


export default class ParticleEmitter {

	pos: Vector2 = new Vector2();
	color: HSLA;
	particles: Particle[] = [];
	radius: number;
	alive: boolean = true;
	lifespan: number;


	constructor (
		
		pos: Vector2,
		color: HSLA = HSLA.random(),
		radius = 64,
		lifespan = 100,
	
	) {
		this.pos = pos;
		this.color = color;
		this.radius = radius;
		this.lifespan = lifespan;
		this.create();
	}


	private create () {

		const count = Math.ceil(this.radius * this.radius * Math.PI * 0.05);

		this.createExplosionRadiusIndicator(count);
		this.createExpellingDebree(count);

	}


	private createExplosionRadiusIndicator (count: number): void {
		for (let i = 0; i < count; i++) {

			const alpha = 1 || 0.25 + 0.75 * Math.pow(Math.random(), 2);
			const size = Math.ceil(2 * Math.pow(Math.random(), 3));
			const pos = Vector2.from(randomPointInCircle(this.radius));
			const lifespan = Math.round(this.lifespan * 0.3 + this.lifespan * 0.7 * Math.random());
			const color = (
				this.color
					.copy()
					.mutate()
					.setA(alpha)
					.setL(50 + 50 * Math.random())
			);

			this.particles.push(
				new Particle(
					color,
					pos.add(this.pos),
					new Vector2(),
					size,
					lifespan,
				)
			);

		}
	}
	

	private createExpellingDebree (count: number): void {
		for (let i = 0; i < count; i++) {

			const alpha = 1 || 0.25 + 0.75 * Math.pow(Math.random(), 2);
			const size = Math.ceil(3 * Math.pow(Math.random(), 2));
			const pos = Vector2.from(randomPointInCircle(this.radius));
			const lifespan = Math.round(this.lifespan * 0.5 + this.lifespan * 0.5 * Math.random());
			const speed = (this.radius / 5) * Math.pow(Math.random(), 3);
			const color = (
				this.color
					.copy()
					.mutate()
					.setA(alpha)
					.setL(50 + 50 * Math.random())
			);

			this.particles.push(
				new Particle(
					color,
					pos.add(this.pos),
					Vector2.fromAngle(this.pos.angleTo(pos)).scaleN(speed),
					size,
					lifespan,
				)
			);

		}
	}


	public update () {

		this.particles = this.particles.filter(p => p.alive);

		if (!this.particles.length) {
			this.alive = false;
			return;
		}

		for (const p of this.particles) {

			if (p.age >= p.lifespan) {
				p.alive = false;
				continue;
			}

			p.pos.add(p.vel);
			p.vel.scaleN(0.95);
			p.size = p.baseSize * ((p.lifespan - p.age) / p.lifespan);
			p.age++;

		}

	}

}
