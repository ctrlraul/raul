import GameState from "../classes/GameState";
import Ship from "../ships/Ship";
import ParticleEmitter from "../particles/ParticleEmitter";
import Projectile, { ProjectileType } from "../projectiles/Projectile";
import Settings from "../singletons/Settings";
import lineToCircleCollision from "../utils/lineToCircleCollision";
import Vector2 from "../utils/Vector2";



// Types

interface ProjectileRenderConfig {
	ctx: CanvasRenderingContext2D;
	gs: GameState;
	p: Projectile;
}

type PRFs = {
	[T in ProjectileType]: (config: ProjectileRenderConfig) => void;
};



// Exports

const projectileRenderingFunctions: PRFs = {
	point,
	line,
};


export default projectileRenderingFunctions;



// Rendering functions

function point ({ p, ctx }: ProjectileRenderConfig): void {

	const { dir } = p;
	const pos = p.pos.copy().scaleN(Settings.GRAPHIC_SCALE);
	const speed = p.speed * Settings.GRAPHIC_SCALE;
	const size = p.size * Settings.GRAPHIC_SCALE;


	// trail

	if (p.age > 0) {
		ctx.beginPath();
		ctx.lineWidth = size;
		ctx.strokeStyle = p.owner.color.copy().setA(0.3).toCSS();

		ctx.moveTo(pos.x, pos.y);
		ctx.lineTo(
			pos.x + dir.x * -speed,
			pos.y + dir.y * -speed
		);

		ctx.stroke();
		ctx.closePath();
	}


	// Projectile

	ctx.beginPath();
	ctx.lineWidth = size;
	ctx.strokeStyle = p.owner.color.toCSS();

	ctx.moveTo(
		pos.x + dir.x * -(size * 0.5),
		pos.y + dir.y * -(size * 0.5)
	);

	ctx.lineTo(
		pos.x + dir.x * (size * 0.5),
		pos.y + dir.y * (size * 0.5)
	);

	ctx.stroke();
	ctx.closePath();

}


function line (cfg: ProjectileRenderConfig): void {

	const { ctx, gs, p } = cfg;
	const colliding = getNearestCollidingData(p, gs.ships);
	const color = p.owner.color.copy().setL(50 + 50 * Math.random());

	let doMakeParticles = true;
	let emitterLifespan = 100;
	let emitterRadius = 3;
	let point: Vector2;

	if (colliding) {

		doMakeParticles = Math.random() > 0.6;
		point = colliding.point;

	} else {

		emitterLifespan = 20;
		emitterRadius = 1;

		point = new Vector2(
			p.pos.x + p.dir.x * p.size,
			p.pos.y + p.dir.y * p.size
		);

	}

	const graphicPos = p.pos.copy().scaleN(Settings.GRAPHIC_SCALE);
	const graphicPointPos = point.copy().scaleN(Settings.GRAPHIC_SCALE);

	ctx.beginPath();
	ctx.lineWidth = 1 + Math.random() * Settings.GRAPHIC_SCALE;
	ctx.strokeStyle = color.toCSS();

	ctx.moveTo(graphicPos.x, graphicPos.y);
	ctx.lineTo(graphicPointPos.x, graphicPointPos.y);

	ctx.stroke();
	ctx.closePath();

	if (doMakeParticles) {
		gs.particles.push(
			new ParticleEmitter(
				point,
				p.owner.color,
				emitterRadius,
				emitterLifespan
			)
		);
	}

}



// Utils

function getNearestCollidingData (p: Projectile, _ships: Ship[]): { ship: Ship, point: Vector2 } | null {

	const distances = _ships.filter(ship => ship.alive).map(ship => {
		return { ship, distance: p.pos.distance(ship.pos) };
	});

	const ships = distances
		.filter(x => x.ship !== p.owner)
		.sort((a, b) => a.distance - b.distance)
		.map(x => x.ship);

	for (const ship of ships) {

		const collides = lineToCircleCollision(
			p.pos,
			p.pos.copy().add(p.dir.copy().scaleN(p.size)),
			ship.pos,
			ship.areaRadius,
		);

		if (collides.length) {
			return { ship, point: collides[0] || collides[1] || new Vector2() };
		}

	}

	return null;

}
