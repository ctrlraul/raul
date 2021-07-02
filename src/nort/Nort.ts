import CanvasRenderer from "./renderer/CanvasRenderer";
import GameState from "./classes/GameState";
import PlayerControl from "./PlayerControl";
import Mouse from "./classes/Mouse";
import Vector2 from "./utils/Vector2";
import ShipsM from './ships/ShipsManager';
import ProjsM from './projectiles/ProjectilesManager';
import Camera from "./classes/Camera";
import Ship from "./ships/Ship";
import SpritesManager from "./renderer/SpritesManager";



// Types

interface NortConfig {
  canvas: HTMLCanvasElement;
  spriteSheets: {
    hulls: string;
    turrets: string;
  };
}



// Exports

const Nort = {
  init,
  getGameState,
};

export default Nort;



// Data

const gs = new GameState();
let didInit = 0;


// Methods

async function init (config: NortConfig) {

  if (didInit++) {
    throw new Error(`Already initialized`);
  }


  const { canvas } = config;

  const mouse = new Mouse();
  const camera = new Camera();
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;


  adjustCanvasSize(canvas);


  window.addEventListener("resize", () => {
    adjustCanvasSize(canvas);
  });

  window.addEventListener('mousemove', e => {
    updateMousePosition(mouse, camera, e);
  });


  await SpritesManager.loadImages(config.spriteSheets);


  // Update loop
  const loop = () => {

    updateMousePosition(mouse, camera);
    adjustCameraToFitShips(camera, gs);


    // Render
    CanvasRenderer.render({ canvas, ctx, gs, mouse, camera });

    // Update
    PlayerControl.update(mouse);
    ProjsM.update(gs); // Update projectiles before ships. -Raul
    ShipsM.update(gs);

    for (const emitter of gs.particles) {
      emitter.update();
    }


    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);

}


// Functions

function getGameState (): GameState {
  return gs;
}

function adjustCanvasSize (canvas: HTMLCanvasElement): void {
  if (canvas.parentElement) {
    canvas.width  = canvas.parentElement.offsetWidth  * window.devicePixelRatio;
    canvas.height = canvas.parentElement.offsetHeight * window.devicePixelRatio;
  }
}

function updateMousePosition (mouse: Mouse, camera: Camera, e?: MouseEvent): void {

  if (e) {
    mouse.clientPos.x = e.clientX;
    mouse.clientPos.y = e.clientY;
  }

  const root = document.body;
  const center = new Vector2(root.offsetWidth, root.offsetHeight).scaleN(0.5);

  mouse.pos
    .set(mouse.clientPos)
    .sub(center)
    .divN(camera.zoom)
    .add(camera.pos)

}

function adjustCameraToFitShips (camera: Camera, gs: GameState): void {

  let ships: Ship[] = []
  
  if (gs.ships.length) {

    const now = Date.now();

    ships.push(...gs.ships);
    ships.push(
      ...gs.deadShips.filter(ship =>
        now - ship.deathTimestamp < 1000
      )
    );

  } else if (gs.deadShips.length) {

    ships.push(
      [...gs.deadShips].sort((a, b) => b.deathTimestamp - a.deathTimestamp)[0]
    );

  }

  if (!ships.length) return;

  const screenFitPadding = 50;
  const cameraMotionRate = 0.1;
  const zoomPhasingRate = 0.05;


  const cornerA = new Vector2(Infinity, Infinity);
  const cornerB = new Vector2(-Infinity, -Infinity);
  const averagePos = new Vector2();

  for (const ship of ships) {
    cornerA.x = Math.min(cornerA.x, ship.pos.x);
    cornerA.y = Math.min(cornerA.y, ship.pos.y);
    cornerB.x = Math.max(cornerB.x, ship.pos.x);
    cornerB.y = Math.max(cornerB.y, ship.pos.y);
    averagePos.add(ship.pos);
  }

  const rect = {
    x: cornerA.x - screenFitPadding,
    y: cornerA.y - screenFitPadding,
    w: cornerB.x - cornerA.x + screenFitPadding * 2,
    h: cornerB.y - cornerA.y + screenFitPadding * 2,
  };

  const scaleW = 1 / (rect.w / window.innerWidth);
  const scaleH = 1 / (rect.h / window.innerHeight);
  const scale = Math.min(scaleW, scaleH);

  averagePos.divN(ships.length);


  camera.pos.x = averagePos.x * cameraMotionRate + camera.pos.x * (1 - cameraMotionRate);
  camera.pos.y = averagePos.y * cameraMotionRate + camera.pos.y * (1 - cameraMotionRate);
  camera.zoom = scale * zoomPhasingRate + camera.zoom * (1 - zoomPhasingRate);

}
