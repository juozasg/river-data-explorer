
let _toggleHideTooltips = $state(false);

export const toggleHideTooltips = {
	get hide() {
		return _toggleHideTooltips;
	}
}

export function toggleHideTooltipsKeydown(e: KeyboardEvent) {
	if(e.key === 't') {
		_toggleHideTooltips = !_toggleHideTooltips;
	}
}
