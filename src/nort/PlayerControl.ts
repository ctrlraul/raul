import Mouse from "./classes/Mouse";
import Ship from "./ships/Ship";
import ShipsManager from "./ships/ShipsManager";
import Vector2 from "./utils/Vector2";



// Exports

const PlayerControl = {
	update,
	setBody,
};

export default PlayerControl;



// Data

let click = false;
const keyboard = {
	KeyA: false,
	KeyS: false,
	KeyD: false,
	KeyW: false,
};

let body: Ship | null = null;



// Methods

function update (mouse: Mouse): void {

	if (!body) return;

	body.firing = click;

	ShipsManager.rotateTurretTowardsAngle(body, body.turretPos.angleTo(mouse.pos));

	const motion = new Vector2();

	if (keyboard.KeyA) motion.x -= 1;
	if (keyboard.KeyS) motion.y += 1;
	if (keyboard.KeyD) motion.x += 1;
	if (keyboard.KeyW) motion.y -= 1;

	if (motion.x || motion.y) {
		ShipsManager.accelerateShip(body, motion.angle());
	}

}

function setBody (ship: Ship | null): void {
	// if (ship) {
	// 	console.log('Controlling:', ship);
	// }
	body = ship;
}




// Event listeners

window.addEventListener('mousedown',  () => { click = true  });
window.addEventListener('touchstart', () => { click = true  });
window.addEventListener('mouseup',    () => { click = false });
window.addEventListener('touchend',   () => { click = false });

window.addEventListener('keydown', e => {
	keyboard[e.code as keyof typeof keyboard] = true;
});

window.addEventListener('keyup', e => {
	keyboard[e.code as keyof typeof keyboard] = false;
});
