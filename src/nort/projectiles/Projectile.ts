import { ProjectileModifier } from "../projectileModifiers/ProjectileModifiersManager";
import Ship from "../ships/Ship";
import Vector2 from "../utils/Vector2";



// Types

export type ProjectileType = 'point' | 'line';

interface Options {
	type: ProjectileType;
	owner: Ship;

	pos: Vector2;
	dir: Vector2;

	lifespan?: number;

	size?: number;
	damage?: number;
	speed?: number;
	explosionRadius?: number;
}



// Exports

export default class Projectile {

	// Base data
	type: ProjectileType;
	owner: Ship;
	
	// Physics
	pos: Vector2;
	dir: Vector2;

	// Memeto Mori
	age = 0;
	alive = true;
	lifespan: number;

	// Stats
	size: number;
	damage: number;
	speed: number;
	explosionRadius: number;

	// Modifiers
	modifiers: ProjectileModifier[] = [];


	constructor (opts: Options) {

		this.type = opts.type;
		this.owner = opts.owner;

		this.pos = opts.pos;
		this.dir = opts.dir;

		this.lifespan = opts.lifespan || 30;

		this.size = opts.size || 2;
		this.damage = opts.damage || 1;
		this.speed = typeof opts.speed === 'number' ? opts.speed : 1;
		this.explosionRadius = opts.explosionRadius || 0;

	}

}
