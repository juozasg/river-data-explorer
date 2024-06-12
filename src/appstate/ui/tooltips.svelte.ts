
let _toggleHideTooltips = $state(false);

export const toggleHideTooltips = {
	get hide() {
		return _toggleHideTooltips;
	},

	set(hide: boolean) {
		_toggleHideTooltips = hide;
	},

	keydown(e: KeyboardEvent) {
		if(e.key === 't') {
			toggleHideTooltips.set(!toggleHideTooltips.hide);
		}
	}
}
