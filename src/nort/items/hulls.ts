import { SpriteSourceData } from "../renderer/SpritesManager";
import Vector2 from "../utils/Vector2";


export interface HullItemType {
  id: number;
  name: string;
  tier: number;
  sprite: SpriteSourceData;
  joint: Vector2;
  stats: {
		health: number;
		energy: number;
		acceleration: number;
	};
};


const accMult = 0.0045;


const hulls: HullItemType[] = [{
	id: 1,
	name: 'Merlot',
	tier: 1,
	sprite: new SpriteSourceData('hulls', 2, 2, 14, 14),
	joint: new Vector2(8, 5),
	stats: {
		health: 10 * 10,
		energy: 10 * 10,
		acceleration: 10 * accMult,
	},
}, {
	id: 4,
	name: 'Baltic',
	tier: 1,
	sprite: new SpriteSourceData('hulls', 20, 2, 14, 14),
	joint: new Vector2(7, 5),
	stats: {
		health: 8 * 10,
		energy: 10 * 10,
		acceleration: 12 * accMult,
	},
}, {
	id: 16,
	name: 'Hammerhead',
	tier: 1,
	sprite: new SpriteSourceData('hulls', 38, 2, 14, 14),
	joint: new Vector2(7, 5),
	stats: {
		health: 9 * 10,
		energy: 12 * 10,
		acceleration: 9 * accMult,
	},
}, {
	id: 17,
	name: 'Bandit',
	tier: 1,
	sprite: new SpriteSourceData('hulls', 56, 2, 14, 14),
	joint: new Vector2(7, 6),
	stats: {
		health: 11 * 10,
		energy: 9.5 * 10,
		acceleration: 9.5 * accMult,
	},
}, {
	id: 18,
	name: 'Asther',
	tier: 1,
	sprite: new SpriteSourceData('hulls', 74, 2, 14, 14),
	joint: new Vector2(7, 5),
	stats: {
		health: 9 * 10,
		energy: 12.5 * 10,
		acceleration: 8.5 * accMult,
	},
}, {
	id: 19,
	name: 'Satin',
	tier: 1,
	sprite: new SpriteSourceData('hulls', 92, 2, 14, 14),
	joint: new Vector2(7, 7),
	stats: {
		health: 10 * 10,
		energy: 9 * 10,
		acceleration: 11 * accMult,
	},
}, {
	id: 20,
	name: 'Crown',
	tier: 1,
	sprite: new SpriteSourceData('hulls', 110, 2, 14, 14),
	joint: new Vector2(7, 6),
	stats: {
		health: 15.5 * 10,
		energy: 9.5 * 10,
		acceleration: 5 * accMult,
	},
}, {
	id: 21,
	name: 'Prisma',
	tier: 1,
	sprite: new SpriteSourceData('hulls', 128, 2, 14, 14),
	joint: new Vector2(7, 6),
	stats: {
		health: 7.5 * 10,
		energy: 11.5 * 10,
		acceleration: 11 * accMult,
	},
}, {
	id: 22,
	name: 'Engineer',
	tier: 2,
	sprite: new SpriteSourceData('hulls', 2, 20, 16, 16),
	joint: new Vector2(8, 11),
	stats: {
		health: 10.5 * 10,
		energy: 11.5 * 10,
		acceleration: 11 * accMult,
	},
}, {
	id: 23,
	name: 'Patton',
	tier: 2,
	sprite: new SpriteSourceData('hulls', 22, 20, 16, 16),
	joint: new Vector2(8, 8),
	stats: {
		health: 13 * 10,
		energy: 9 * 10,
		acceleration: 11 * accMult,
	},
}, {
	id: 24,
	name: 'Flagship',
	tier: 2,
	sprite: new SpriteSourceData('hulls', 42, 20, 16, 16),
	joint: new Vector2(5, 4),
	stats: {
		health: 12.5 * 10,
		energy: 6.5 * 10,
		acceleration: 14 * accMult,
	},
}, {
	id: 25,
	name: 'Elcent',
	tier: 3,
	sprite: new SpriteSourceData('hulls', 2, 40, 18, 18),
	joint: new Vector2(9, 12),
	stats: {
		health: 12 * 10,
		energy: 13 * 10,
		acceleration: 11 * accMult,
	},
}, {
	id: 26,
	name: 'Aave',
	tier: 4,
	sprite: new SpriteSourceData('hulls', 2, 62, 20, 20),
	joint: new Vector2(10, 9),
	stats: {
		health: 16 * 10,
		energy: 11.5 * 10,
		acceleration: 11.5 * accMult,
	},
}];


export default hulls;
