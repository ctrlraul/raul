import Vector2 from "../utils/Vector2";
import HSLA from "../utils/HSLA";
import hulls, { HullItemType } from "../items/hulls";
import turrets, { TurretItemType } from "../items/turrets";
import ShipsManager from "./ShipsManager";
import ProjectileModifiersM, { ProjectileModifierInit, ProjectileModifierName } from "../projectileModifiers/ProjectileModifiersManager";
import SpritesManager, { ItemSprite } from "../renderer/SpritesManager";


interface Args {
  hull?: HullItemType;
  turret?: TurretItemType;

  color?: HSLA;

  pos?: Vector2;
  vel?: Vector2;
  hullAngle?: number;
  turretAngle?: number;

  targetPos?: Vector2;
  targetShips?: Ship[];

  attackingSide?: number;

  invulnerable?: boolean;

  showInfo?: boolean;

  projectileModifiers?: ProjectileModifierName[];
};


export default class Ship {

  // Items
  hull: HullItemType;
  turret: TurretItemType;

  // Physics
  pos: Vector2;
  vel: Vector2;
  hullAngle: number;
  turretAngle: number;
  turretPos: Vector2;
  areaRadius: number;

  // Controlling
  targetPos: Vector2 | null;
  targetShips: Ship[];
  nearestTargetShip: Ship | null = null;
  attackingSide: number;

  // Firing
  firing = false;
  firingCooldown = 0;
  reloadTime = 0;

  // Stats
  healthCap: number;
  health: number;
  ammoCap: number;
  ammo: number;
  invulnerable: boolean;

  // Memeto Mori
  alive = true;
  deathTimestamp = -1;

  // Graphic
  showInfo: boolean;
  hullSprite: ItemSprite;
  turretSprite: ItemSprite;
  color: HSLA;

  // Modifiers
  projectileModifiers: ProjectileModifierInit[];


  constructor (args: Args = {}) {

    // Items
    this.hull = args.hull || hulls[Math.floor(Math.random() * hulls.length)];
    this.turret = args.turret || turrets[Math.floor(Math.random() * turrets.length)];

    // Physics
    this.pos = args.pos || new Vector2();
    this.vel = args.vel || new Vector2();
    this.hullAngle = args.hullAngle || (Math.PI * 2 * Math.random());
    this.turretAngle = args.turretAngle || this.hullAngle;
    this.turretPos = ShipsManager.getShipTurretPosition(this);
    this.areaRadius = this.hull.sprite.width * 0.5;

    // Controlling
    this.targetPos = args.targetPos || null;
    this.targetShips = args.targetShips || [];
    this.attackingSide = args.attackingSide || (Math.random() > 0.5 ? 1 : -1);

    // Stats
    this.healthCap = this.hull.stats.health;
    this.health = this.healthCap;
    this.ammoCap = this.turret.stats.ammo;
    this.ammo = this.ammoCap;
    this.invulnerable = args.invulnerable || false;

    // Graphic
    this.color = args.color || HSLA.random();
    this.hullSprite = SpritesManager.createItemSprite(this.hull, this.color.toCSS());
    this.turretSprite = SpritesManager.createItemSprite(this.turret, this.color.toCSS());
    this.showInfo = typeof args.showInfo === 'boolean' ? args.showInfo : true;

    // Modifiers
    this.projectileModifiers = (
      args.projectileModifiers
      ? args.projectileModifiers.map(ProjectileModifiersM.getModifierInitByName)
      : []
    );

  }

}
