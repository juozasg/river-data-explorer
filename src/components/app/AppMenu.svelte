<script lang="ts">
	import HamburgerButton from "./HamburgerButton.svelte";
	import { clickOutside } from "$src/lib/svelte/clickOutside";
	import InlineBlockIconify from "../icons/InlineBlockIconify.svelte";
	import { mapSelectionMode } from "$src/appstate/selection/basinObjectSelection.svelte";

	const { mobile }: { mobile: boolean } = $props();

	let open = $state(false);
	let searchFocused = $state(false);
	const searchPlaceholder = $derived(mobile || searchFocused ? "Search" : "");
</script>

<div
	class="app-menu"
	class:mobile
	use:clickOutside={() => {
		open = false;
	}}
	class:search-focused={searchFocused}>
	<div class="hamburger" class:open>
		<HamburgerButton bind:open />
	</div>
	<ul class:open>
		<li class="search">
			<div class="search-icon"><InlineBlockIconify icon="fluent:search-12-filled" size="28px" /></div>
			<input
				type="text"
				onkeydown={(e) => {
					if (e.key === "Escape") e.currentTarget?.blur();
				}}
				placeholder={searchPlaceholder}
				bind:focused={searchFocused} />
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
			font-size: 1.1rem;
			line-height: 40px;
			margin-right: 8px;
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
