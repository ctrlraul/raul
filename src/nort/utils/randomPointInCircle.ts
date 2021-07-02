export default function randomPointInCircle (radius: number) {
	const t = 2 * Math.PI * Math.random();
	const u = Math.random() + Math.random();
	const r = u > 1 ? 2 - u : u;
	return {
		x: Math.cos(t) * r * radius,
		y: Math.sin(t) * r * radius,
	}
};
