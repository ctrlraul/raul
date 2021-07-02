import GameState from "../classes/GameState";
import Ship from "../ships/Ship";
import ShipsM from "../ships/ShipsManager";
import ParticleEmitter from "../particles/ParticleEmitter";
import Projectile from "./Projectile";



// Exports

const PointProjectilesManager = {
	update,
	onDeath,
};

export default PointProjectilesManager;



// Methods

function update (p: Projectile, gs: GameState): void {
	move(p);
	handleCollisions(p, gs);
}


function onDeath (p: Projectile, gs: GameState): void {

	if (p.explosionRadius > 0) {
		for (const ship of gs.ships) {

			if (ship === p.owner) continue;
		
			const dist = Math.max(0, p.pos.distance(ship.pos) - ship.areaRadius);
	
			if (dist < p.explosionRadius) {

				ShipsM.dealDamage(ship, p.damage * (1 - dist / p.explosionRadius));

				ShipsM.accelerateShip(
					ship,
					p.pos.angleTo(ship.pos),
					(p.explosionRadius - dist) * 0.1,
				);
			}
	
		}
	}

	gs.particles.push(
		new ParticleEmitter(
			p.pos.copy(),
			p.owner.color.copy(),
			p.size + p.explosionRadius,
			(p.size + p.explosionRadius) * 2,
		),
	);
}


// Utils

function move (p: Projectile): void {
	p.pos.add(p.dir.copy().scaleN(p.speed));
}


function handleCollisions (p: Projectile, gs: GameState): void {
	for (const ship of gs.ships) {
			
		if (ship === p.owner) continue;

		const dist = p.pos.distance(ship.pos) - p.size - ship.areaRadius;

		if (dist <= 0) {
			onHitShip(p, ship);
			break;
		}

	}
}


function onHitShip (p: Projectile, ship: Ship): void {

	// If it's an explosive we let the onDeath call deal the damage
	if (p.explosionRadius === 0) {
		ShipsM.dealDamage(ship, p.damage);
	}

	p.alive = false;

}
