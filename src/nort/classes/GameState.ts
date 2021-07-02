import ProjectileBase from "../projectiles/Projectile";
import Ship from "../ships/Ship";
import ParticleEmitter from "../particles/ParticleEmitter";
import HSLA from "../utils/HSLA";



type StartGameFn = () => Record<string, (ConstructorParameters<typeof Ship>[0])[]>;


interface DeathMatchConfig {
  color?: HSLA;
  ships: ConstructorParameters<typeof Ship>[0][];
}


class GameState {
  
  ships: Ship[] = [];
  deadShips: Ship[] = [];
  projectiles: ProjectileBase[] = [];
  particles: ParticleEmitter[] = [];


  public clear () {
    this.ships = [];
    this.deadShips = [];
    this.projectiles = [];
    this.particles = [];
  }


  public start (startGameFn: StartGameFn): void {

    this.clear();

    const rawData = startGameFn();
    const data: Record<string, Ship[]> = {};

    for (const team in rawData) {
      data[team] = [];
      for (const shipArgs of rawData[team]) {
        data[team].push(this.addShip(shipArgs));
      }
    }

    for (const teamA in data) {
      for (const teamB in data) {

        if (teamA === teamB) continue;

        for (const ship of data[teamA]) {
          ship.targetShips.push(...data[teamB]);
        }

      }
    }

  }


  public deathmatch (fn: () => DeathMatchConfig): void {

    this.clear();
    
    const { color, ships: shipsArgs } = fn();

    const ships = shipsArgs.map(args =>
      new Ship({ color, ...args })
    );

    for (const a of ships) {
      for (const b of ships) {
        if (a !== b) {
          a.targetShips.push(b);
        }
      }
    }

    this.ships.push(...ships);

  }


  public addShip (...args: ConstructorParameters<typeof Ship>) {
    const ship = new Ship(...args);
    this.ships.push(ship);
    return ship;
  }

}


export default GameState;
