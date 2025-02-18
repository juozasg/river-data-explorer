<script lang="ts">
	import HamburgerButton from "./HamburgerButton.svelte";
	import { clickOutside } from "$src/lib/svelte/clickOutside";
	import InlineBlockIconify from "../icons/InlineBlockIconify.svelte";

	const { mobile }: { mobile: boolean } = $props();

	let open = $state(false);
	let searchFocused = $state(false);
	const searchPlaceholder = $derived(mobile || searchFocused ? 'Search' : '');



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
			<div class="search-icon"><InlineBlockIconify icon="gridicons:search" size="28px" /></div>
			<input type="text"
			onkeydown={(e) => { if(e.key === 'Escape') e.currentTarget?.blur()}}
			placeholder={searchPlaceholder}
			bind:focused={searchFocused} />
		</li>
		<li><a target="_blank" href="help.html">User Guide</a></li>
		<li>
			<a target="_blank" href="https://github.com/Limnogirl90/SJRBC-web-map-data/tree/webapp/datasets">
				Download Datasets
			</a>
		</li>
	</ul>
</div>

<style>
	.app-menu {
		display: inline-block;
		width: 100%;
		height: 100%;

		border: 2px greenyellow dashed;
	}

	.hamburger {
		display: none;
	}

	ul {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		border: 1px red solid;
		/* display: inline-flex; */
	}

	li {
		height: 40px;
		display: inline-block;
		margin: 0;
		padding: 0;
		border: 2px blue dotted;
		font-weight: bold;
	}

	li.search {
		padding: 0;
		margin: 0;
		position: relative;
		.search-icon {
			position: absolute;
			top: 5px;
			left: 6px;
			color: var(--color-lightGrey);
			pointer-events: none;
		}
		input {
			width: 42px !important;
			height: 36px;
			padding-left: 42px !important;
			margin: 0;
		}
	}

	.app-menu.search-focused, li.search:hover {
		.search-icon {
			color: var(--color-darkGrey);
		}
	}

	.app-menu.search-focused:not(.mobile) {
		li.search {
			width: 100%;
		}

		li.search input {
			width: 100% !important;
		}

		li:not(.search) {
			display: none;
		}
	}

	.app-menu.mobile {
		width: var(--headerHeight);

		background: black;

		.hamburger {
			display: block;
			color: white;
			font-size: 1.5rem;
		}

		ul {
			display: none;
		}

		ul.open {
			display: block;
			width: calc(100vw - 2px); /* 1px border on each side */
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
					color: blue;
				}
			}
		}

		li.search {
			input {
				width: 100% !important;
			}
		}
	}
</style>
