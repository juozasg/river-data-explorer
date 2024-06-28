import { notify } from "./notifications.svelte";

let _toggleHideTooltips = $state(false);

export const toggleHideTooltips = {
	get hide() {
		return _toggleHideTooltips;
	}
}

export function toggleHideTooltipsKeydown(e: KeyboardEvent) {
	if(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
		return;
	}

	if(e.key === 't') {
		_toggleHideTooltips = !_toggleHideTooltips;
		if(_toggleHideTooltips == true) {
			notify('Tooltips hidden. Press "T" to show.');
		}
	}
}
