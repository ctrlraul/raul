import { NortItem } from "../items/ItemsManager";
import Settings from "../singletons/Settings";
import Vector2 from "../utils/Vector2";



// Types and classes

export class SpriteSourceData {
  sheet: string;
  x: number;
  y: number;
  width: number;
  height: number;

  constructor (
    sheet: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    
    this.sheet = sheet;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
};

export interface ItemSprite {
  readonly data: HTMLCanvasElement;
  readonly item: NortItem;
}



// Exports

const SpritesManager = {
	createItemSprite,
	loadImages,
	drawItem,
	drawRawItem,
};

export default SpritesManager;



// Data

const sheets: Record<string, HTMLImageElement> = {};



// Methods

function createItemSprite (item: NortItem, color: string): ItemSprite {

	const spriteData = item.sprite;
	const image = sheets[spriteData.sheet];

	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
	const width = spriteData.width * Settings.GRAPHIC_SCALE;
	const height = spriteData.height * Settings.GRAPHIC_SCALE;

	const padding = Settings.ITEM_SPRITE_PADDING;

	canvas.width  = width  + padding * 2;
	canvas.height = height + padding * 2;

	if (image) {

		const draw = () => {
			ctx.drawImage(
				image,
				spriteData.x,
				spriteData.y,
				spriteData.width,
				spriteData.height,
				padding,
				padding,
				width,
				height,
			);
		};

		// ctx.globalAlpha = 0.25;

		// For pixel art
		ctx.imageSmoothingEnabled = false;

		// Draw grey sprite
		draw();

		// Give it some color
		ctx.globalCompositeOperation = 'multiply';
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Remove the parts of the color rectangle
		// that are in transparent areas
		ctx.globalCompositeOperation = 'destination-in';
		draw();

		// Draw outline
		ctx.globalCompositeOperation = 'normal';
		ctx.shadowColor = 'black';
		ctx.shadowBlur = 0.2 * Settings.GRAPHIC_SCALE;
		for (let i = 0; i < 8; i++) {
			ctx.drawImage(canvas, 0, 0);
		}

		// Draw joint (white square)
		ctx.fillStyle = '#ffffff';
		ctx.shadowColor = '#ffffff';
		ctx.shadowBlur = Settings.GRAPHIC_SCALE * 1.25;
		ctx.fillRect(
			padding + (item.joint.x - 1) * Settings.GRAPHIC_SCALE,
			padding + (item.joint.y - 1) * Settings.GRAPHIC_SCALE,
			2 * Settings.GRAPHIC_SCALE,
			2 * Settings.GRAPHIC_SCALE,
		);

	} else {

		console.warn(`No sheet with name '${spriteData.sheet}' loaded.`);

		ctx.beginPath();

		ctx.lineWidth = 1;
		ctx.strokeStyle = '#00ff00';

		ctx.rect(0.5, 0.5, width - 1, height - 1);
		ctx.moveTo(0, 0);
		ctx.lineTo(width, height);

		ctx.stroke();

		ctx.closePath();

	}

	return { data: canvas, item };
}


function loadImages (imagesMap: Record<string, string>): Promise<void[]> {

	const promises: Promise<void>[] = [];

	for (const [name, src] of Object.entries(imagesMap)) {

		promises.push(
			new Promise((resolve, reject) => {

				const image = document.createElement('img');
		
				image.addEventListener('load', () => resolve());
				image.addEventListener('error', () => {
					const err = new Error(`Failed to load '${name}' from '${src}'`);
					console.log(err);
					reject(err);
				});
		
				image.src = src;
	
				sheets[name] = image;      
		
			})
		);

	}

	return Promise.all(promises);

}


function drawItem (
	ctx: CanvasRenderingContext2D,
	sprite: ItemSprite,
	pos: Vector2,
	origin: Vector2,
	angle: number,
): void {

	const width = sprite.item.sprite.width * Settings.GRAPHIC_SCALE;
	const height = sprite.item.sprite.height * Settings.GRAPHIC_SCALE;
	const _pos = pos.copy().scaleN(Settings.GRAPHIC_SCALE);

	ctx.translate(_pos.x, _pos.y);
	ctx.rotate(angle);

	ctx.drawImage(
		sprite.data,
		width  * -origin.x,
		height * -origin.y,
		width,
		height,
	);

	ctx.rotate(-angle);
	ctx.translate(-_pos.x, -_pos.y);

}


function drawRawItem (
	ctx: CanvasRenderingContext2D,
	data: SpriteSourceData,
	x: number,
	y: number,
	width: number,
	height: number,
): void {

	const image = sheets[data.sheet];

	ctx.imageSmoothingEnabled = false;

	ctx.drawImage(
		image,
		data.x,
		data.y,
		data.width,
		data.height,
		x,
		y,
		width,
		height,
	);

	ctx.imageSmoothingEnabled = true;

}
