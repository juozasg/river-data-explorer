import type WebsiteTooltip from "$src/components/tooltips/WebsiteTooltip.svelte";
import type { Snippet } from "svelte";
import { notify } from "./notifications.svelte";


let _websiteTooltip: WebsiteTooltip | undefined = $state();
let _toggleHideTooltips = $state(false);


export const tooltip = {
	set component(t: WebsiteTooltip) {
		_websiteTooltip = t;
	},


	show(x: number, y: number, toggleable = false) {
		_websiteTooltip?.show(x, y, toggleable);
	},

	hide() {
		_websiteTooltip?.hide();
	},

	set content(c: Snippet) {
		_websiteTooltip?.setContentSnippet(c);
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

	// console.log('toggleHideTooltipsKeydown', e.key, _tooltip?.isToggleable());

	if(e.key === 't' && _websiteTooltip?.isToggleable()) {
		tooltip.toggledHidden = !tooltip.toggledHidden;
		if(_toggleHideTooltips == true) {
			notify('Tooltips hidden. Press "T" to show.');
		}
	}
}
