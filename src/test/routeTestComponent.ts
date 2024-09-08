import TestMap from "./TestMap.svelte";
import UnknowTestRoute from "./UnknowTestRoute.svelte";

export function routeTestComponent(name: string) {
	switch(name) {
		case "map":
			return TestMap

		default:
			return UnknowTestRoute;
	}
}