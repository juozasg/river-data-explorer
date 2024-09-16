import TestBasin from "./TestBasin.svelte";
import TestBasinChart from "./TestBasin.svelte";
import TestMLMap from "./TestMLMap.svelte";
import TestNotifications from "./TestNotifications.svelte";
import TestVarDataMap from "./TestVarDataMap.svelte";
import UnknowTestRoute from "./UnknowTestRoute.svelte";

export function routeTestComponent(name: string) {
	switch (name) {
		case "map":
			return TestMLMap;
		case "vardatamap":
			return TestVarDataMap;
		case "basinchart":
			return TestBasinChart;
		case "notifications":
			return TestNotifications;
		case "basin":
			return TestBasin;
		default:
			return UnknowTestRoute;
	}
}