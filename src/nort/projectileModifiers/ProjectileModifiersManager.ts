import GameState from '../classes/GameState';
import Projectile from '../projectiles/Projectile';
import Homing from './homing';



// Types

export type ProjectileModifierInit = (p: Projectile, gs: GameState) => ProjectileModifier;
export type ProjectileModifier = (gs: GameState) => void;
export type ProjectileModifierName = keyof typeof mods;



// Data

const mods = {
	'homing': Homing,
};



// Exports

const ProjectileModifiersManager = {
	getModifierInitByName,
};

export default ProjectileModifiersManager;



// Methods

function getModifierInitByName (name: ProjectileModifierName): ProjectileModifierInit {
	return mods[name];
}
