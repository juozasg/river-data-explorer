export function closestPointIndex(arr: number[], x: number, min = true) {
	// if(!min) {
	// 	x += 0.05;
	// }
	const foundPoint = arr.reduce((prev, curr) =>
				Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev);
	let index = arr.indexOf(foundPoint);
	if (min && foundPoint > x) {
		index -= 1;
	} else if(!min && foundPoint < x) {
		// index += 1;
	}

	if(index < 0) {
		index = 0;
	} else if(index >= arr.length) {
		index = arr.length - 1;
	}

	return index;
}