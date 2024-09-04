import type WebsiteTooltip from "$src/components/tooltips/WebsiteTooltip.svelte";
import type { Snippet } from "svelte";
import { notify } from "./notifications.svelte";


let _tooltip: WebsiteTooltip | undefined = $state();
let _toggleHideTooltips = $state(false);


export const tooltip = {
	set component(t: WebsiteTooltip) {
		_tooltip = t;
	},

	set(value: WebsiteTooltip | undefined) {
		_tooltip = value;
	},

	show(x: number, y: number, toggleable = false) {
		if(_tooltip) _tooltip.show(x, y, toggleable);
	},

	hide() {
		if(_tooltip) _tooltip.hide();
	},

	set content(c: Snippet) {
		if(_tooltip) _tooltip.setContentSnippet(c);
	},

	get toggledHidden() {
		return _toggleHideTooltips;
	},

	set toggledHidden(doHide) {
		_toggleHideTooltips = doHide;
		if(_toggleHideTooltips) {
			this.hide();
		}
	}


};


export function toggleHideTooltipsKeydown(e: KeyboardEvent) {
	if(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
		return;
	}

	if(e.key === 't' && _tooltip?.isToggleable()) {
		tooltip.toggledHidden = !tooltip.toggledHidden;
		if(_toggleHideTooltips == true) {
			notify('Tooltips hidden. Press "T" to show.');
		}
	}
}
