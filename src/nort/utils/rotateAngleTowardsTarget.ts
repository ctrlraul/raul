export default function rotateAngleTowardsTarget (angle: number, targetAngle: number, rotationAmount: number): number {

	// calculate difference of angles and compare them to find the correct turning direction
	const delta = Math.abs(deltaAngle(targetAngle - angle, Math.PI / 2));
	const dir = delta < Math.PI / 2;

	angle += rotationAmount * (dir ? 1 : -1);

	// To check if the angle has gone over the target
	const delta2 = Math.abs(deltaAngle(targetAngle - angle, Math.PI / 2));
	const didGoOverTheTarget = dir !== (delta2 < Math.PI / 2);

	return didGoOverTheTarget ? targetAngle : angle;

}



// Utils

function deltaAngle (current: number, target: number) {
	const delta = repeat((target - current), Math.PI * 2);
	return delta > Math.PI ? delta - Math.PI * 2 : delta;
}

function repeat (t: number, length: number) {
	return clamp(t - Math.floor(t / length) * length, 0, length);
}

function clamp (x: number, min: number, max: number) {
	return Math.max(min, Math.min(max, x));
}
