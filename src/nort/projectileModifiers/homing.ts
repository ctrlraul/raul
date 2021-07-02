import Ship from "../ships/Ship";
import rotateAngleTowardsTarget from "../utils/rotateAngleTowardsTarget";
import Vector2 from "../utils/Vector2";
import { ProjectileModifierInit } from "./ProjectileModifiersManager";


// Modifier implementation

const init: ProjectileModifierInit = (p, gs) => {

	const rotationScale = 0.05;
	const ship = getNearestShip(p.pos, gs.ships.filter(ship => {
		return ship !== p.owner && ship.alive
	}));

	return () => {

		if (ship === null) return;

		const angle = rotateAngleTowardsTarget(
			p.dir.angle(),
			p.pos.angleTo(ship.pos),
			rotationScale
		);

		p.dir.setXY(Math.cos(angle), Math.sin(angle));
		
	};

};


// Utils

function getNearestShip (pos: Vector2, ships: Ship[]): Ship | null {

	function loop (pos: Vector2, ships: Ship[], nearest = Infinity): Ship | null {

		if (ships.length === 0) {
			return null;
		}

		if (ships.length === 1) {
			return ships[0];
		}

		const distance = pos.distance(ships[1].pos);

		return (
			distance < nearest
			? loop(pos, ships.slice(1 - ships.length), distance)
			: loop(pos, [ships[0], ...ships.slice(2)], nearest)
		);

	}

	return loop(pos, ships);

}


// Exports

export default init;
