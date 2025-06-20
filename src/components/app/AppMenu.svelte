<script lang="ts">
	import HamburgerButton from "./HamburgerButton.svelte";
	import { clickOutside } from "$src/lib/svelte/clickOutside";
	import InlineBlockIconify from "../icons/InlineBlockIconify.svelte";
	import { basinObject1, mapSelectionMode } from "$src/appstate/selection/basinObjectSelection.svelte";
	import type { BasinObjectType } from "$src/appstate/data/basinObject.svelte";
	import BasinObjectSearchResults from "../basinobject/BasinObjectSearchResults.svelte";

	const { mobile }: { mobile: boolean } = $props();

	let inputElement: HTMLInputElement;
	const onfocus = () => {
		searchFocused = true;
		inputElement.setSelectionRange(0, inputElement.value.length);
		inputElement.focus();
	};
	const onblur = () => (searchFocused = false);

	let value: string = $state("");
	let open = $state(false);
	let showResults = $state(false);
	let searchFocused = $state(false);

	$effect(() => {
		if (searchFocused && value.length > 1) showResults = true;
	});

	const searchPlaceholder = $derived(mobile || searchFocused ? "Search" : "");

	const selectObject = (objectType: BasinObjectType, id: number) => {
		console.log("selectObject", objectType, id);
		basinObject1.set(objectType, id);
		value = "";
		if(mapSelectionMode.mode == 'auto' && mapSelectionMode.target == "1") mapSelectionMode.target = "2"; // Switch to target 2 if in auto mode

	};
</script>

<div
	class="app-menu"
	class:mobile
	use:clickOutside={() => {
		open = false;
		showResults = false;
		// console.log('clickOutside');
	}}
	class:search-focused={searchFocused || showResults}>
	<div class="hamburger" class:open>
		<HamburgerButton bind:open />
	</div>
	<ul class:open>
		<li class="search">
			<div class="search-icon"><InlineBlockIconify icon="fluent:search-12-filled" size="28px" /></div>
			<input
				type="text"
				bind:value
				bind:this={inputElement}
				onkeydown={(e) => {
					if (e.key === "Escape") {
						e.currentTarget?.blur();
						showResults = false;
					}
				}}
				placeholder={searchPlaceholder}
				{onblur}
				{onfocus} />
			{#if showResults && value.length > 1}
				<div class="global-search-results">
					<BasinObjectSearchResults {selectObject} query={value} />
				</div>
			{/if}
		</li>
		<li><a target="_blank" href="help.html">User Guide</a></li>
		<li>
			<a target="_blank" href="https://github.com/Limnogirl90/SJRBC-web-map-data/tree/webapp/datasets">
				Download Datasets
				<span class="github-icon">
					<InlineBlockIconify icon="uiw:github" size="20px" />
				</span>

				<span>{mapSelectionMode.mode} {mapSelectionMode.target}</span>
			</a>
		</li>
	</ul>
</div>

<style>
	.app-menu {
		display: inline-block;
		width: 100%;
		height: 100%;
		/* border: 2px greenyellow dashed; */
	}

	.hamburger {
		display: none;
	}

	ul {
		display: flex;
		list-style: none;
		justify-content: flex-start;
		margin: 0;
		padding: 0;
		/* border: 1px red solid; */
		/* display: inline-flex; */
	}

	li {
		height: 40px;
		display: inline-block;
		margin: 0;
		padding: 0;
		padding-top: 1px;
		padding-left: 4px;
		/* border: 2px blue dotted; */
		font-weight: bold;

		a {
			font-size: 20px;
			line-height: 40px;
			margin-right: 12px;
			color: var(--stjoe-blue);
			white-space: nowrap;
		}

		a:hover {
			color: var(--color-darkGrey);
		}

		a .github-icon {
			position: relative;
			top: 2px;
			/* margin-left: 0.5rem; */
		}
	}

	li.search {
		padding: 0;
		margin: 0;
		position: relative;
		.search-icon {
			position: absolute;
			top: 7px;
			left: 10px;
			color: var(--stjoe-blue);
			pointer-events: none;
		}
		input {
			width: 42px !important;
			height: 36px;
			padding-left: 52px !important;
			margin: 0;
			border: none !important;
		}
	}

	:global(.global-search-results .basin-object-search-results ) {
		/* position: relative; */
		/* padding-top: 8px; */
		top: 40px;
		/* background-color: purple; */
	}

	.app-menu.search-focused,
	li.search:hover {
		.search-icon {
			color: var(--color-darkGrey);
		}
	}

	li.search:hover {
		.search-icon {
			opacity: 0.75;
		}
	}

	.app-menu:not(.search-focused) {
		input:hover {
			cursor: pointer;
		}
	}

	.app-menu.search-focused:not(.mobile) {
		li.search {
			width: 100%;
		}

		li.search input {
			width: 100% !important;
			padding-left: 58px !important;
			padding-top: 5px !important;
			font-size: 1.1rem !important;
			border: none !important;
		}

		li:not(.search) {
			display: none;
		}
	}

	.app-menu.mobile {
		width: var(--headerHeight);

		/* background: black; */

		.hamburger {
			display: block;
			/* color: white; */
			font-size: 1.5rem;
		}

		ul {
			display: none;
		}

		ul.open {
			display: block;
			background-color: white;
			width: 100vw;
			position: relative;
			top: -3px;
		}

		li {
			display: block;
			width: 100%;

			a {
				width: 100%;
				padding: 1rem;
				text-align: left;
				cursor: pointer;

				&:hover {
					background: var(--color-hover);
					/* color: blue; */
				}
			}
		}

		li.search {
			input {
				width: 100% !important;
				padding-left: 48px !important;
				padding-top: 6px !important;
			}

			.search-icon {
				/* position: absolute; */
				/* top: 6px; */
				left: 16px;
				/* color: var(--stjoe-blue); */
				/* pointer-events: none; */
			}
		}
	}
</style>
