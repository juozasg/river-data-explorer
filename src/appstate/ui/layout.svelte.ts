let _mapMaximized = $state(true);

export const mapMaximized = () => _mapMaximized;
export function setMapMaximized(maximized: boolean) {
	_mapMaximized = maximized;
}

