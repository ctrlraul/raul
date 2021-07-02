import GameState from "../classes/GameState";
import LineProjectilesManager from "./LineProjectilesManager";
import PointProjectilesManager from "./PointProjectilesManager";
import Projectile, { ProjectileType } from "./Projectile";


// Exports

const ProjectilesManager = {
  update,
};

export default ProjectilesManager;


// Methods

const managers: { [K in ProjectileType]: any } = {
  point: PointProjectilesManager,
  line: LineProjectilesManager,
};


function update (gs: GameState): void {

  ageUp(gs.projectiles);

  const { alive, dead } = separateDeadAndAlive(gs.projectiles);

  for (const p of dead) {
    managers[p.type].onDeath(p, gs);
  }

  for (const p of alive) {
    if (!managers[p.type]) {
      console.log(p);
      debugger;
    }
    managers[p.type].update(p, gs);

    for (const modifier of p.modifiers) {
      modifier(gs);
    }
  }

  gs.projectiles = alive;

}


function separateDeadAndAlive (projectiles: Projectile[]) {

  const alive: Projectile[] = [];
  const dead: Projectile[] = [];

  for (const p of projectiles) {
    const group = p.alive ? alive : dead;
    group.push(p);
  }

  return { alive, dead };

}


function ageUp (projectiles: Projectile[]): void {
  for (const p of projectiles) {
    p.age++;
    if (p.age > p.lifespan) {
      p.alive = false;
    }
  }
}
