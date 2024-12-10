import TestBasin from "$src/components/test-pages/TestBasin.svelte";
import TestBasinChartcopy from "$src/components/test-pages/TestBasinChart copy.svelte";
import TestMlMap from "$src/components/test-pages/TestMLMap.svelte";
import TestNotifications from "$src/components/test-pages/TestNotifications.svelte";
import TestVarDataMap from "$src/components/test-pages/TestVarDataMap.svelte";
import UnknowTestRoute from "$src/components/test-pages/UnknowTestRoute.svelte";



export function routeTestComponent(name: string) {
	switch (name) {
		case "map":
			return TestMlMap;
		case "vardatamap":
			return TestVarDataMap;
		case "basinchart":
			return TestBasinChartcopy;
		case "notifications":
			return TestNotifications;
		case "basin":
			return TestBasin;
		default:
			return UnknowTestRoute;
	}
}