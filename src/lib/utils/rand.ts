export function randCoord() {
	return [-86.0 + Math.random(), 41.2 + Math.random()];
	// return [41.2 + Math.random(), -85.0 + Math.random()];
}

export function randCoords() {
	return Array.from({ length: 1000 }, () => randCoord());
}

export function randomHexColor() {
	return "#" + Math.floor(Math.random() * 16777215).toString(16);
}


export function randPointFeatureCollection(numPoints: number) {
	return {
		type: "FeatureCollection",
		features: Array.from({ length: numPoints }, (_, v) => ({
			type: "Feature",
			id: v + 1,
			// id: "site-" + v,
			properties: {
				name: "site-" + v
			},
			geometry: {
				type: "Point",
				coordinates: randCoord()
			}
		}))
	};
}