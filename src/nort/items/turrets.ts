import createProjectileFactory, { ProjectileFactory } from "../projectiles/createProjectileFactory";
import { SpriteSourceData } from "../renderer/SpritesManager";
import Vector2 from "../utils/Vector2";


export interface TurretItemType {
  id: number;
  name: string;
  tier: number;
  sprite: SpriteSourceData;
  joint: Vector2;
  stats: {
		ammo: number;
		reloadTime: number;
		weight: number;
		cooldown: number;
		rotationSpeed: number;
		firingRange: number;
	};
	projectiles: ProjectileFactory[],
};


const turrets: TurretItemType[] = [
{
	id: 2,
	name: 'Basic',
	tier: 1,
	sprite: new SpriteSourceData('turrets', 2, 2, 12, 12),
	joint: new Vector2(6, 9),
	stats: {
		ammo: 6,
		reloadTime: 100,
		weight: 0.25,
		cooldown: 20,
		rotationSpeed: 0.05,
		firingRange: 150,
	},
	projectiles: [
		createProjectileFactory({
			type: 'point',
			offset: [0, 9],
			angleSpread: 4,
			size: 2,
			speed: 3,
			damage: 8,
			lifespan: 50,
		}),
	]
}, {
	id: 3,
	name: 'Heavy',
	tier: 1,
	sprite: new SpriteSourceData('turrets', 18, 2, 12, 12),
	joint: new Vector2(6, 8),
	stats: {
		ammo: 4,
		reloadTime: 120,
		weight: 0.30,
		cooldown: 20,
		rotationSpeed: 0.02,
		firingRange: 120,
	},
	projectiles: [
		createProjectileFactory({
			type: 'point',
			offset: [0, 9],
			size: 2.5,
			speed: 3,
			damage: 24,
			angleSpread: 4,
			lifespan: 40,
		}),
	],

}, {
	id: 5,
	name: 'Machinegun',
	tier: 1,
	sprite: new SpriteSourceData('turrets', 34, 2, 12, 12),
	joint: new Vector2(6, 8),
	stats: {
		ammo: 16,
		reloadTime: 200,
		weight: 0.35,
		cooldown: 10,
		rotationSpeed: 0.05,
		firingRange: 180,
	},
	projectiles: [
		createProjectileFactory({
			type: 'point',
			offset: [0, 8],
			size: 1.5,
			speed: 4.5,
			damage: 5,
			angleSpread: 10,
			lifespan: 40,
		}),
	],

}, {
	id: 6,
	name: 'Dual',
	tier: 1,
	sprite: new SpriteSourceData('turrets', 50, 2, 12, 12),
	joint: new Vector2(6, 8),
	stats: {
		ammo: 5,
		reloadTime: 130,
		weight: 0.40,
		cooldown: 20,
		rotationSpeed: 0.05,
		firingRange: 90,
	},
	projectiles: [
		createProjectileFactory({
			type: 'point',
			offset: [2.5, 7],
			size: 1.5,
			speed: 3,
			damage: 5,
			angleSpread: 1,
			lifespan: 30,
		}),
		createProjectileFactory({
			type: 'point',
			offset: [-2.5, 7],
			size: 1.5,
			speed: 3,
			damage: 5,
			angleSpread: 1,
			lifespan: 30,
		}),
	],
}, {
	id: 7,
	name: 'Luminous Drill',
	tier: 2,
	sprite: new SpriteSourceData('turrets', 2, 18, 14, 14),
	joint: new Vector2(7, 11),
	stats: {
		ammo: 200,
		reloadTime: 40,
		weight: 0.05,
		cooldown: 0,
		rotationSpeed: 0.05,
		firingRange: 70,
	},
	projectiles: [
		createProjectileFactory({
			type: 'line',
			offset: [0, 10.5],
			size: 70,
			damage: 0.24,
			angleSpread: 1,
			lifespan: 1,
		}),
	]

}, {
	id: 8,
	name: 'Heavy Dual',
	tier: 2,
	sprite: new SpriteSourceData('turrets', 20, 18, 14, 14),
	joint: new Vector2(7, 9),
	stats: {
		ammo: 5,
		reloadTime: 170,
		weight: 0.40,
		cooldown: 30,
		rotationSpeed: 0.05,
		firingRange: 90,
	},
	projectiles: [
		createProjectileFactory({
			type: 'point',
			offset: [3, 8],
			size: 2,
			speed: 3,
			damage: 10,
			angleSpread: 1,
			lifespan: 30,
		}),
		createProjectileFactory({
			type: 'point',
			offset: [-3, 8],
			size: 2,
			speed: 3,
			damage: 10,
			angleSpread: 1,
			lifespan: 30,
		}),
	]

}, {
	id: 9,
	name: 'Chaingun',
	tier: 2,
	sprite: new SpriteSourceData('turrets', 38, 18, 14, 14),
	joint: new Vector2(7, 10),
	stats: {
		ammo: 32,
		reloadTime: 150,
		weight: 0.30,
		cooldown: 4,
		rotationSpeed: 0.05,
		firingRange: 80,
	},
	projectiles: [
		createProjectileFactory({
			type: 'point',
			offset: [0, 10],
			size: 1,
			speed: 6,
			damage: 2,
			angleSpread: 7,
			lifespan: 15,
		}),
	]

}, {
	id: 10,
	name: 'Drizzle',
	tier: 2,
	sprite: new SpriteSourceData('turrets', 56, 18, 14, 14),
	joint: new Vector2(7, 7),
	stats: {
		ammo: 200,
		reloadTime: 180,
		weight: 0.10,
		cooldown: 0,
		rotationSpeed: 0.05,
		firingRange: 40,
	},
	projectiles: [
		createProjectileFactory({
			type: 'point',
			offset: [0, 4.5],
			size: 0.75,
			speed: 3,
			damage: 1.5,
			angleSpread: 70,
			lifespan: 14,
		}),
	]

}, {
	id: 11,
	name: 'Bomber',
	tier: 2,
	sprite: new SpriteSourceData('turrets', 92, 18, 14, 14),
	joint: new Vector2(7, 8),
	stats: {
		ammo: 3,
		reloadTime: 140,
		weight: 0.20,
		cooldown: 70,
		rotationSpeed: 0.05,
		firingRange: 80,
	},
	projectiles: [
		createProjectileFactory({
			type: 'point',
			offset: [0, 6],
			size: 3,
			speed: 4,
			damage: 20,
			angleSpread: 4,
			lifespan: 20,
			explosionRadius: 10,
		}),
	],
}, {
	id: 12,
	name: 'Conqueror',
	tier: 3,
	sprite: new SpriteSourceData('turrets', 2, 36, 16, 16),
	joint: new Vector2(8, 10),
	stats: {
		ammo: 10,
		reloadTime: 50,
		weight: 0.38,
		cooldown: 12,
		rotationSpeed: 0.05,
		firingRange: 200,
	},
	projectiles: [
		createProjectileFactory({
			type: 'point',
			offset: [0, 9],
			size: 2,
			speed: 1,
			explosionRadius: 0,
			damage: 5,
			angleSpread: 16,
			lifespan: 200,
		}),
	]

}, {
	id: 13,
	name: 'Seekers',
	tier: 3,
	sprite: new SpriteSourceData('turrets', 22, 36, 16, 16),
	joint: new Vector2(8, 8),
	stats: {
		ammo: 5,
		reloadTime: 300,
		weight: 0.5,
		cooldown: 20,
		rotationSpeed: 0,
		firingRange: 200,
	},
	projectiles: [
		createProjectileFactory({
			type: 'point',
			offset: [0, 5.5],
			size: 2,
			speed: 4,
			explosionRadius: 0,
			damage: 10,
			angleSpread: 360,
			lifespan: 100,
			modifiers: ['homing'],
		}),
	]

}, {
	id: 14,
	name: 'Glowing Lance',
	tier: 3,
	sprite: new SpriteSourceData('turrets', 42, 36, 16, 16),
	joint: new Vector2(8, 11),
	stats: {
		ammo: 3,
		reloadTime: 100,
		weight: 0.2,
		cooldown: 20,
		rotationSpeed: 0.05,
		firingRange: 50,
	},
	projectiles: [
		createProjectileFactory({
			type: 'line',
			offset: [0, 10],
			size: 100,
			damage: 0.5,
			angleSpread: 0,
			lifespan: 25,
		}),
	]
}, {
	id: 15,
	name: 'Rhino',
	tier: 4,
	sprite: new SpriteSourceData('turrets', 2, 56, 18, 18),
	joint: new Vector2(9, 11),
	stats: {
		ammo: 1,
		reloadTime: 300,
		weight: 0.5,
		cooldown: 300,
		rotationSpeed: 0.05,
		firingRange: 150,
	},
	projectiles: [
		createProjectileFactory({
			type: 'point',
			offset: [0, 13],
			size: 4,
			speed: 6,
			damage: 35,
			angleSpread: 0,
			lifespan: 100,
		}),
	]
}, {
	id: 27,
	name: 'Mine Lander',
	tier: 3,
	sprite: new SpriteSourceData('turrets', 62, 36, 16, 16),
	joint: new Vector2(8, 8),
	stats: {
		ammo: 3,
		reloadTime: 120,
		weight: 0.5,
		cooldown: 60,
		rotationSpeed: 0,
		firingRange: 200,
	},
	projectiles: [
		createProjectileFactory({
			type: 'point',
			offset: [0, -5.5],
			size: 3,
			speed: 0,
			damage: 20,
			lifespan: 2000,
			explosionRadius: 20,
		}),
	]
}, {
	id: 28,
	name: 'Scarab',
	tier: 4,
	sprite: new SpriteSourceData('turrets', 24, 56, 20, 20),
	joint: new Vector2(9, 9),
	stats: {
		ammo: 15,
		reloadTime: 15,
		weight: 0.3,
		cooldown: 0,
		rotationSpeed: 0.05,
		firingRange: 120,
	},
	projectiles: [
		createProjectileFactory({
			type: 'line',
			offset: [3.5, 9],
			size: 100,
			damage: 0.1,
			angle: -1.8,
			angleSpread: 0.5,
			lifespan: 1,
		}),
		createProjectileFactory({
			type: 'line',
			offset: [-3.5, 9],
			size: 100,
			damage: 0.1,
			angle: 1.8,
			angleSpread: 0.5,
			lifespan: 1,
		}),
	]
}];


export default turrets;
