import Vector2 from "./Vector2";

// A rework of https://stackoverflow.com/a/37225895
// I really don't know how it works, just removed
// the comments, they were useless.

export default function lineToCircleCollision (

	p1: Vector2,
	p2: Vector2,
	circlePos: Vector2,
	radius: number,

): Vector2[] {
	
	const v1 = new Vector2(p2.x - p1.x, p2.y - p1.y);
	const v2 = new Vector2(p1.x - circlePos.x, p1.y - circlePos.y);

	const b = (v1.x * v2.x + v1.y * v2.y) * -2;
	const c = 2 * (v1.x * v1.x + v1.y * v1.y);
	const d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - radius * radius));

	if (isNaN(d)) {
		return [];
	}

	const u1 = (b - d) / c;
	const u2 = (b + d) / c;

	const points: Vector2[] = [];
	
	if (u1 <= 1 && u1 >= 0) {
		points[0] = new Vector2(p1.x + v1.x * u1, p1.y + v1.y * u1);
	}

	if (u2 <= 1 && u2 >= 0) {
		points[1] = new Vector2(p1.x + v1.x * u2, p1.y + v1.y * u2);
	}

	return points as [Vector2, Vector2];
}
