import GameState from "../classes/GameState";
import Ship from "../ships/Ship";
import ShipsManager from "../ships/ShipsManager";
import lineToCircleCollision from "../utils/lineToCircleCollision";
import Vector2 from "../utils/Vector2";
import Projectile from "./Projectile";



// Exports

const LineProjectilesManager = {
	update,
	onDeath,
	getNearestCollidingData,
};

export default LineProjectilesManager;



// Methods

function update (p: Projectile, gs: GameState): void {
	const colliding = getNearestCollidingData(p, gs.ships);

	if (colliding) {
		onHitShip(p, colliding.ship);
	}
}


function onDeath (p: Projectile, gs: GameState): void {}


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


// Utils

function onHitShip (p: Projectile, ship: Ship): void {
	ShipsManager.dealDamage(ship, p.damage);
}
