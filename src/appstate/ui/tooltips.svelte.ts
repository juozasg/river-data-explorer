import type WebsiteTooltip from "$src/components/website/WebsiteTooltip.svelte";
import type { Snippet } from "svelte";
import { notify } from "./notifications.svelte";


let _tooltip: WebsiteTooltip | undefined = $state();

export const tooltip = {
	set component(t: WebsiteTooltip) {
		_tooltip = t;
	},

	set(value: WebsiteTooltip | undefined) {
		_tooltip = value;
	},

	show(x: number, y: number) {
		if(_tooltip) _tooltip.show(x, y);
	},

	hide() {
		if(_tooltip) _tooltip.hide();
	},

	set content(c: Snippet) {
		if(_tooltip) _tooltip.setContent(c);
	}

};


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
