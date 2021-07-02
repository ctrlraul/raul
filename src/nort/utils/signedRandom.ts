// if spread is 10, returns a random number from -5 to 5
export default function signedRandom (spread: number = 1): number {
	return (spread * 0.5) - (spread * Math.random());
}
