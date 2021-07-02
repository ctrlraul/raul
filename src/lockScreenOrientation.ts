type LockOrientationFn = (orientation: OrientationLockType) => boolean;

declare var screen: Screen & {
	lockOrientation?: LockOrientationFn;
	mozLockOrientation?: LockOrientationFn;
	msLockOrientation?: LockOrientationFn;
}


export default async function lockScreenOrientation (orientation: OrientationLockType): Promise<void> {

	// Check if supports newest API

	if ('orientation' in screen && 'lock' in screen.orientation) {
		await screen.orientation.lock(orientation);
		return;
	}

	// Fallback to deprecated API

	const lock = (
		   screen.lockOrientation
		|| screen.mozLockOrientation
		|| screen.msLockOrientation
	);

	if (!lock) {
		throw new Error(`Locking screen orientation not supported.`);
	}

	const allowed = lock(orientation);

	if (!allowed) {
		throw new Error(`Locking screen orientation not allowed.`);
	}

}
