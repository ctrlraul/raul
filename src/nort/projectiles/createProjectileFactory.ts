import GameState from "../classes/GameState";
import ProjectileModifiersM, { ProjectileModifierName } from "../projectileModifiers/ProjectileModifiersManager";
import Ship from "../ships/Ship";
import signedRandom from "../utils/signedRandom";
import Vector2 from "../utils/Vector2";
import Projectile, { ProjectileType } from "./Projectile";


// Types

export type ProjectileFactory = (owner: Ship, gs: GameState) => Projectile;

interface Config {
	type: ProjectileType;
	offset: [x: number, y: number];
	modifiers?: ProjectileModifierName[];
	lifespan?: number;
	size?: number;
	damage?: number;
	speed?: number;
	explosionRadius?: number;
	angle?: number;
	angleSpread?: number;
}


// Utils

const degToRad = 0.017453292519943295;


// Exports

export default function createProjectileFactory (cfg: Config): ProjectileFactory {

	return (owner, gs) => {

		const angle = (cfg.angle || 0) + signedRandom(cfg.angleSpread || 0);
		const dir = Vector2.fromAngle(owner.turretAngle).rotate(angle * degToRad);
		const dirPerp = Vector2.fromAngle(owner.turretAngle + Math.PI * 0.5);

		const pos = owner.turretPos.new
			.add(dir.new.scaleN(cfg.offset[1]))
			.add(dirPerp.new.scaleN(cfg.offset[0]));


		const projectile = new Projectile({
			type: cfg.type,
			owner,
			dir: dir,
			pos,
			lifespan: cfg.lifespan,
			size: cfg.size,
			damage: cfg.damage,
			speed: cfg.speed,
			explosionRadius: cfg.explosionRadius,
		});


		// Init projectile modifiers
		{
			const inits = [...owner.projectileModifiers];

			if (cfg.modifiers) {
				for (const name of cfg.modifiers) {
					inits.push(
						ProjectileModifiersM.getModifierInitByName(name)
					);
				}
			}

			for (const init of inits) {
				projectile.modifiers.push(
					init(projectile, gs)
				);
			}
		}


		return projectile;

	};

};
