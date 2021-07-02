import Ship from "./Ship";
import ProjectileBase from "../projectiles/Projectile";
import GameState from "../classes/GameState";
import signedRandom from "../utils/signedRandom";
import Vector2 from "../utils/Vector2";
import ParticleEmitter from "../particles/ParticleEmitter";
import rotateAngleTowardsTarget from "../utils/rotateAngleTowardsTarget";



// Exports

const ShipsManager = {
	update,
	dealDamage,
	getShipTurretPosition,
	rotateShipTowardsAngle,
	rotateTurretTowardsAngle,
	accelerateShip,
};

export default ShipsManager;



// Methods

function update (gs: GameState): void {

  const { alive, dead } = separateDeadAndAlive(gs.ships);

  for (const ship of dead) {
    onDeath(ship, gs);
  }

  for (const ship of alive) {

		tickAI(ship);
		motion(ship);

		const projsFired = firing(ship, gs);

		gs.projectiles.push(...projsFired);

	}

  gs.ships = alive;
	gs.deadShips = dead;

}


function dealDamage (ship: Ship, damage: number): void {
	if (!ship.invulnerable) {
		ship.health -= damage;
	
		if (ship.health <= 0) {
			ship.alive = false;
		}
	}
}


function getShipTurretPosition (ship: Ship): Vector2 {

	const turretSize = new Vector2(ship.hull.sprite.width, ship.hull.sprite.height);

	return ship.pos.copy()
		.sub(turretSize.scaleN(0.5))
		.add(ship.hull.joint)
		.rotateFrom(ship.pos, ship.hullAngle + Math.PI * 0.5)

}


function rotateShipTowardsAngle (ship: Ship, angle: number): void {
	ship.hullAngle = rotateAngleTowardsTarget(ship.hullAngle, angle, 0.05);

	if (ship.turret.stats.rotationSpeed === 0) {
		ship.turretAngle = ship.hullAngle;
	}
}


function rotateTurretTowardsAngle (ship: Ship, angle: number): void {
	ship.turretAngle = rotateAngleTowardsTarget(
		ship.turretAngle,
		angle,
		ship.turret.stats.rotationSpeed,
	);
}


function accelerateShip (ship: Ship, angle: number, force?: number): void {

	const motion = Vector2.fromAngle(angle);

	motion.scaleN(force || (ship.hull.stats.acceleration * (1 - ship.turret.stats.weight)));

	// Accelerate
	ship.vel.add(motion);

	rotateShipTowardsAngle(ship, ship.vel.angle());
	// rotateShipTowardsAngle(ship, motion.angle());

}



// Routine functions

function tickAI (ship: Ship): void {

	if (!ship.ai) {
		return;
	}

	if (ship.nearestTargetShip && !ship.nearestTargetShip.alive) {
		ship.nearestTargetShip = null;
	}

	ship.nearestTargetShip = getNearestTargetShip(ship);

	if (ship.nearestTargetShip === null) {
		ship.firing = false;
		return;
	}

	rotateTurretTowardsAngle(ship, ship.pos.angleTo(ship.nearestTargetShip.pos));

	const distanceFromTarget = ship.nearestTargetShip.alive && (
		ship.pos.distance(ship.nearestTargetShip.pos)
		- ship.areaRadius
		- ship.nearestTargetShip.areaRadius
	);

	ship.firing = distanceFromTarget < ship.turret.stats.firingRange;


	if (ship.targetPos) return;

	// Switch the direction that makes it orbit
	//the target clockwise or anti-clockwise
	if (Math.random() < 0.3) {
		ship.attackingSide *= -1;
	}

	ship.targetPos = getPositionToHuntTarget(ship, ship.nearestTargetShip);

}


function motion (ship: Ship): void {
	// Rotate (graphically and physically)
	// towards the target position, might
	// deserve it's own method.
	if (ship.targetPos) {

		const radius = ship.areaRadius;
		const distance = ship.pos.distance(ship.targetPos) - radius;
		
		if (distance <= 0) {
			ship.targetPos = null;
		} else {
			accelerateShip(ship, ship.pos.angleTo(ship.targetPos));
		}

	}

	moveShip(ship);
	ship.turretPos = getShipTurretPosition(ship);

}


function firing (ship: Ship, gs: GameState): ProjectileBase[] {

	if (ship.firing) {

		let canFire = true;

		if (ship.firingCooldown > 0) {
			canFire = false;
		}

		if (ship.reloadTime > 0) {
			canFire = false;
		}

		if (ship.ammo <= 0) {
			canFire = false;
		}

		if (canFire) {
			ship.firingCooldown = ship.turret.stats.cooldown;
			ship.ammo -= 1;

			if (ship.ammo <= 0) {
				ship.reloadTime = ship.turret.stats.reloadTime;
			}

			return ship.turret.projectiles.map(
				factory => factory(ship, gs)
			);
		}

	}

	ship.firingCooldown = Math.max(0, ship.firingCooldown - 1);
	ship.reloadTime = Math.max(0, ship.reloadTime - 1);

	if (ship.reloadTime <= 0 && ship.ammo <= 0) {
		ship.ammo = ship.turret.stats.ammo;
	}

	return [];

}



// Utils

function getNearestTargetShip (ship: Ship): Ship | null {

	function getDist (target: Ship): number {
		// Yup, this is generic euclidean circle distance
		return (
			ship.pos.distance(target.pos)
			- ship.areaRadius
			- target.areaRadius
		);
	}

	ship.targetShips = ship.targetShips.filter(t => t.alive);

	switch (ship.targetShips.length) {

		case 0: return null;

		case 1: return ship.targetShips[0];

		default: {

			const data = ship.targetShips.map(target => {
				return {
					dist: getDist(target),
					target,
				};
			});

			// TODO: Test if it's faster with reduce
			return data.sort((a, b) => a.dist - b.dist)[0].target;

		}
	}

}


function getPositionToHuntTarget (ship: Ship, target: Ship): Vector2 {

	// TODO: Make this depend on turret state
	const idealDist = ship.turret.stats.firingRange * 0.5 + ship.turret.stats.firingRange * Math.random();
	const currentDist = ship.pos.distance(target.pos);


	const angleToTarget = ship.pos.angleTo(target.pos);

	const pointSideDir = Vector2.fromAngle(
		angleToTarget + Math.PI * 0.5 * ship.attackingSide
	);

	
	// Essentially what controls the average
	// distance it will be from the target
	const counterAngle = angleToTarget + Math.PI;
	const counterEffect = Math.max(0, idealDist * 2 - currentDist);
	const counterDir = Vector2.fromAngle(counterAngle);
	const counterDirEffect = counterDir.copy().scaleN(counterEffect);


	const point = pointSideDir
		.copy()
		.scaleN(idealDist)
		.add(target.pos)
		.add(counterDirEffect);


	return (
		Vector2.fromAngle(ship.pos.angleTo(point))
			.scaleN(ship.areaRadius + 700 * ship.hull.stats.acceleration + Math.random() * signedRandom(20))
			.add(ship.pos)
	);

}


function moveShip (ship: Ship): void {
	ship.pos.add(ship.vel);
	ship.vel.scaleN(0.96); // Decelerate due drag
}


function onDeath (ship: Ship, gs: GameState): void {
	if (!ship.alive && ship.deathTimestamp === -1) {

		ship.deathTimestamp = Date.now();

		gs.particles.push(
			new ParticleEmitter(
				ship.pos.copy(),
				ship.color.copy(),
				ship.areaRadius * 2,
			),
		);

	}
}


function separateDeadAndAlive (projectiles: Ship[]) {

  const alive: Ship[] = [];
  const dead: Ship[] = [];

  for (const p of projectiles) {
    const group = p.alive ? alive : dead;
    group.push(p);
  }

  return { alive, dead };

}
