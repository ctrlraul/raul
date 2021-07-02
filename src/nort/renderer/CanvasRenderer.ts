import GameState from "../classes/GameState";
import Settings from "../singletons/Settings";
import Vector2 from "../utils/Vector2";
import Ship from "../ships/Ship";
import Mouse from "../classes/Mouse";
import projectileRenderingFunctions from "./projectileRenderingFunctions";
import Camera from "../classes/Camera";
import SpritesManager from "./SpritesManager";
import ShipsRenderer from "./ShipsRenderer";
import ParticleEmitter from "../particles/ParticleEmitter";



// Debug

const RENDER_MOUSE_POSITION = 0;



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

function render (cfg: RenderConfig): void {

  const { canvas, ctx, camera, gs } = cfg;

  const cameraPos = camera.pos.copy().scaleN(Settings.GRAPHIC_SCALE);
  const zoom = camera.zoom / Settings.GRAPHIC_SCALE * window.devicePixelRatio;

  clear(canvas, ctx);

  ctx.fillStyle = 'green';
  ctx.font = '1.6rem monospace';
  ctx.fillText(window.devicePixelRatio.toString(), canvas.width - 50, 50);

  ctx.save();


  // Position and zoom
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(zoom, zoom);
  ctx.translate(-cameraPos.x, -cameraPos.y);


  renderGrid(canvas, ctx, camera);
  ShipsRenderer.render(ctx, gs.ships);
  renderProjectiles(ctx, gs);
  renderParticles(ctx, gs.particles);


  // Debug info
  
  if (RENDER_MOUSE_POSITION) {
    renderMousePosition(cfg);
  }


  ctx.restore();

}


function clear (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  clearColor?: string,
): void {

  if (clearColor) {
    ctx.fillStyle = clearColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

}


// Draws a grid relative to the camera to
// give the perception of an infinite grid
// I'm oddly proud of it lol -Raul
function renderGrid (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  camera: Camera,
): void {

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


function renderProjectiles (
  ctx: CanvasRenderingContext2D,
  gs: GameState,
) {
  for (const p of gs.projectiles) {
    projectileRenderingFunctions[p.type]({ gs, ctx, p });
  }
}


function renderParticles (
  ctx: CanvasRenderingContext2D,
  emitters: ParticleEmitter[],
): void {

  for (const emitter of emitters) {
    for (const p of emitter.particles) {

      const size = p.size * Settings.GRAPHIC_SCALE;
      const x = p.pos.x * Settings.GRAPHIC_SCALE;
      const y = p.pos.y * Settings.GRAPHIC_SCALE;

      ctx.fillStyle = p.color.toCSS();
      ctx.fillRect(x - size * 0.5, y - size * 0.5, size, size);
      
    }
  }

}


function renderMousePosition (config: RenderConfig): void {

  const { ctx, mouse } = config;

  ctx.beginPath();
  ctx.arc(mouse.pos.x, mouse.pos.y, 4, 0, Math.PI * 2);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.closePath();

}
