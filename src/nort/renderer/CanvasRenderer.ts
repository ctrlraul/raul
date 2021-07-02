import GameState from "../classes/GameState";
import Settings from "../singletons/Settings";
import Vector2 from "../utils/Vector2";
import Ship from "../ships/Ship";
import Mouse from "../classes/Mouse";
import projectileRenderingFunctions from "./projectileRenderingFunctions";
import Camera from "../classes/Camera";
import SpritesManager from "./SpritesManager";



// Debug

const debug = {
  RENDER_MOUSE_POSITION: 0,
  RENDER_SHIP_FIRING_AREA: 0,
  RENDER_SHIP_RADIUS: 0,
  RENDER_SHIP_TARGET_POSITION: 0,
};



// Types & classes

export interface RenderConfig {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  gs: GameState;
  mouse: Mouse;
  camera: Camera;
}

export class Rect {

	x: number;
	y: number;
	width: number;
	height: number;

	constructor (x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

}



// Exports

const CanvasRenderer = {
  render,
};

export default CanvasRenderer;



// Functions

function render (config: RenderConfig): void {

  const { canvas, ctx, camera } = config;

  const cameraPos = camera.pos.copy().scaleN(Settings.GRAPHIC_SCALE);
  const zoom = config.camera.zoom / Settings.GRAPHIC_SCALE * window.devicePixelRatio;

  clear({ ctx, canvas });

  ctx.fillStyle = 'green';
  ctx.font = '1.6rem monospace';
  ctx.fillText(window.devicePixelRatio.toString(), canvas.width - 50, 50);

  ctx.save();


  // Position and zoom
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(zoom, zoom);
  ctx.translate(-cameraPos.x, -cameraPos.y);


  renderGrid(config);
  renderShips(config);
  renderProjectiles(config);
  renderParticles(config);


  // Debug info
  
  if (debug.RENDER_MOUSE_POSITION) {
    renderMousePosition(config);
  }


  ctx.restore();

}


function clear (config: {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  clearColor?: string;
}): void {

  const { ctx, canvas, clearColor } = config;

  if (clearColor) {
    ctx.fillStyle = clearColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

}


function renderShipFiringArea (ctx: CanvasRenderingContext2D, ship: Ship): void {

  const pos = ship.pos.copy().scaleN(Settings.GRAPHIC_SCALE);
  const radius = (ship.areaRadius + ship.turret.stats.firingRange) * Settings.GRAPHIC_SCALE;

  ctx.beginPath();
  ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
  ctx.lineWidth = 1;
  ctx.strokeStyle = ship.color.copy().setA(0.4).toCSS();
  ctx.fillStyle = ship.color.copy().setA(0.1).toCSS();
  ctx.fill();
  ctx.stroke();
  ctx.closePath();

}


// Draws a grid relative to the camera to
// give the perception of an infinite grid
// I'm oddly proud of it lol -Raul
function renderGrid (config: RenderConfig): void {

  const { canvas, ctx, camera } = config;
  const gridGap = Settings.GRID_GAP * Settings.GRAPHIC_SCALE;

  const pos = camera.pos.copy().scaleN(Settings.GRAPHIC_SCALE);

  const width = canvas.width / camera.zoom * Settings.GRAPHIC_SCALE;
  const height = canvas.height / camera.zoom * Settings.GRAPHIC_SCALE;


  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, Math.PI * 2);

  // Vertical Lines
  {
    const xLines = 1 + Math.ceil(width / gridGap);
    const xCameraOffset = (pos.x + width * 0.5) % gridGap;
    const xCanvasGlobal = width % gridGap;

    for (let i = -1; i < xLines; i++) {
      const x = (pos.x - width  * 0.5) + (i * gridGap) - xCameraOffset + xCanvasGlobal;
      const y = (pos.y - height * 0.5);
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + height);
    }
  }

  // Horizontal Lines
  {
    const yLines = 1 + Math.ceil(height / gridGap);
    const yCameraOffset = (pos.y + height * 0.5) % gridGap;
    const yCanvasGlobal = height % gridGap;

    for (let i = -1; i < yLines; i++) {
      const x = (pos.x - width  * 0.5);
      const y = (pos.y - height * 0.5) + (i * gridGap) - yCameraOffset + yCanvasGlobal;
      ctx.moveTo(x, y);
      ctx.lineTo(x + width, y);
    }
  }

  ctx.lineWidth = window.devicePixelRatio / camera.zoom;
  ctx.strokeStyle = '#ffffff30';
  ctx.stroke();
  ctx.closePath();

}


function renderShips (cfg: RenderConfig): void {

  const { ctx, gs } = cfg;

  for (const ship of gs.ships) {

    if (debug.RENDER_SHIP_FIRING_AREA) {
      renderShipFiringArea(ctx, ship);
    }

    renderShip(ctx, ship);

    if (debug.RENDER_SHIP_RADIUS) {
      renderShipRadius(ctx, ship);
    }

    if (debug.RENDER_SHIP_TARGET_POSITION) {
      renderShipTargetPosition(ctx, ship);
    }

    // This one is purposefully not a debug feature.
    if (ship.showInfo) {
      renderShipInfo(ctx, ship);
    }
  }
}


function renderShip (ctx: CanvasRenderingContext2D, ship: Ship): void {

  SpritesManager.drawItem(
    ctx,
    ship.hullSprite,
    ship.pos,
    new Vector2(0.5, 0.5),
    ship.hullAngle + Math.PI * 0.5,
  );

  const turretSize = new Vector2(ship.turret.sprite.width, ship.turret.sprite.height);
  const turretOrigin = ship.turret.joint.copy().div(turretSize);

  // ship.turretAngle += 0.05;

  SpritesManager.drawItem(
    ctx,
    ship.turretSprite,
    ship.turretPos,
    turretOrigin,
    ship.turretAngle + Math.PI * 0.5,
  );
}


function renderShipInfo (ctx: CanvasRenderingContext2D, ship: Ship): void {

  const pos = ship.pos.copy().scaleN(Settings.GRAPHIC_SCALE);
  const areaRadius = ship.areaRadius * Settings.GRAPHIC_SCALE;

  const barsData = {
    x: pos.x - areaRadius,
    y: pos.y + areaRadius + 10,
    yGap: 1,
    height: Settings.GRAPHIC_SCALE / 2,
    maxWidth: areaRadius * 2,
    bars: [{
      // Health bar
      scale: Math.max(0, ship.health / ship.healthCap),
      color: '#ffffff',
      rangeColor: '#ffffff20',
    }]
  };

  if (ship.ammo > 0) {
    barsData.bars.push({
      // Ammo bar
      scale: Math.max(0, ship.ammo / ship.ammoCap),
      color: '#888888',
      rangeColor: '#88888820',
    });
  }

  if (ship.reloadTime > 0) {
    barsData.bars.push({
      // Reload bar
      scale: Math.max(0, (ship.turret.stats.reloadTime - ship.reloadTime) / ship.turret.stats.reloadTime),
      color: '#ff8060',
      rangeColor: '#ff806020',
    });
  }

  if (ship.firingCooldown > 0) {
    barsData.bars.push({
      // Cooldown bar
      scale: Math.max(0, (ship.turret.stats.cooldown - ship.firingCooldown) / ship.turret.stats.cooldown),
      color: '#6080ff',
      rangeColor: '#6080ff20',
    });
  }

  for (let i = 0; i < barsData.bars.length; i++) {

    const { x, yGap, height, maxWidth } = barsData;
    const { scale, color, rangeColor } = barsData.bars[i];
    const y = barsData.y + height * i + yGap * i;

    drawBar({ ctx, x, y, width: maxWidth, height, color: rangeColor });
    drawBar({ ctx, x, y, width: maxWidth * scale, height, color });


  }
}


function drawBar (opts: {
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
}): void {

  const { ctx, x, y } = opts;

  ctx.beginPath();
  ctx.strokeStyle = opts.color;
  ctx.lineWidth = opts.height;

  ctx.moveTo(x, y);
  ctx.lineTo(x + opts.width, y);

  ctx.stroke();
  ctx.closePath();

}


function renderProjectiles (config: RenderConfig) {
  const { ctx, gs } = config;
  for (const p of gs.projectiles) {
    projectileRenderingFunctions[p.type]({ gs, ctx, p });
  }
}


function renderParticles (config: RenderConfig): void {

  const { ctx } = config;

  for (const emitter of config.gs.particles) {
    for (const p of emitter.particles) {

      const size = p.size * Settings.GRAPHIC_SCALE;
      const x = p.pos.x * Settings.GRAPHIC_SCALE;
      const y = p.pos.y * Settings.GRAPHIC_SCALE;

      ctx.fillStyle = p.color.toCSS();
      ctx.fillRect(x - size * 0.5, y - size * 0.5, size, size);
      
    }
  }

}


function renderShipTargetPosition (ctx: CanvasRenderingContext2D, ship: Ship): void {

  if (!ship.targetPos) {
    return;
  }

  const pos = ship.pos.copy().scaleN(Settings.GRAPHIC_SCALE);
  const targetPos = ship.targetPos.copy().scaleN(Settings.GRAPHIC_SCALE);

  ctx.beginPath();

  ctx.arc(targetPos.x, targetPos.y, Settings.GRAPHIC_SCALE, 0, Math.PI * 2);
  ctx.moveTo(pos.x, pos.y);
  ctx.lineTo(targetPos.x, targetPos.y);

  ctx.lineWidth = 1;
  ctx.strokeStyle = ship.color.toCSS();
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.stroke();

}


function renderMousePosition (config: RenderConfig): void {

  const { ctx, mouse } = config;

  ctx.beginPath();
  ctx.arc(mouse.pos.x, mouse.pos.y, 4, 0, Math.PI * 2);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.closePath();

}


function renderShipRadius (
  ctx: CanvasRenderingContext2D,
  ship: Ship,
): void {

  const pos = ship.pos.copy().scaleN(Settings.GRAPHIC_SCALE);
  const radius = ship.areaRadius * Settings.GRAPHIC_SCALE;

  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#ff0000';
  ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#ffffff';
  ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.closePath();

}
