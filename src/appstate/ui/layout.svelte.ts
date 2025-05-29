let _mapMaximized = $state(true);

export const mapMaximized = () => _mapMaximized;
export function setMapMaximized(maximized: boolean) {
	_mapMaximized = maximized;
}


let _selectedPanel: 'map' | 'data1' | 'data2' | 'chart' = $state('map');

export const selectedPanel = () => _selectedPanel;
export function setSelectedPanel(panel: 'map' | 'data1' | 'data2' | 'chart') {
	_selectedPanel = panel;
}