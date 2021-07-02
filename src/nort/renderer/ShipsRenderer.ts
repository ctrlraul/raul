import Ship from '../ships/Ship';
import Settings from '../singletons/Settings';
import Vector2 from '../utils/Vector2';
import SpritesManager from './SpritesManager';



// Debug

const RENDER_SHIP_FIRING_AREA = 0;
const RENDER_SHIP_RADIUS = 0;
const RENDER_SHIP_TARGET_POSITION = 0;



// Exports

const ShipsRenderer = {
	render,
};

export default ShipsRenderer;



// Functions

function render (ctx: CanvasRenderingContext2D, ships: Ship[]): void {

  for (const ship of ships) {

    if (RENDER_SHIP_FIRING_AREA) {
      renderShipFiringArea(ctx, ship);
    }

    renderShip(ctx, ship);

    if (RENDER_SHIP_RADIUS) {
      renderShipRadius(ctx, ship);
    }

    if (RENDER_SHIP_TARGET_POSITION) {
      renderShipTargetPosition(ctx, ship);
    }

    // This one is purposefully not a debug feature.
    if (ship.showInfo) {
      renderShipInfo(ctx, ship);
    }
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
