import ProjectileBase from "../projectiles/Projectile";
import Ship from "../ships/Ship";
import ParticleEmitter from "../particles/ParticleEmitter";



type StartGameFn = () => Record<string, (ConstructorParameters<typeof Ship>[0])[]>;



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


  public addShip (...args: ConstructorParameters<typeof Ship>) {
    const ship = new Ship(...args);
    this.ships.push(ship);
    return ship;
  }

}


export default GameState;
