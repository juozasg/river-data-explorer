<script lang="ts">
  import HamburgerButton from './HamburgerButton.svelte';
	import { clickOutside } from "$src/lib/svelte/clickOutside";

	const { mobile }: { mobile: boolean } = $props();

	let open = $state(false);
	let searchFocused = $state(false);
</script>

<div class="app-menu" class:mobile use:clickOutside={() => {open = false}}>
	<div class="hamburger" class:open>
		<HamburgerButton bind:open />
	</div>
	<ul class:open>
		<li class="search"><input type="text" placeholder="Search" bind:focused={searchFocused}/></li>
		{#if !searchFocused}
		<li><a target="_blank" href="help.html">User Guide</a></li>
		<li><a target="_blank" href="https://github.com/Limnogirl90/SJRBC-web-map-data/tree/webapp/datasets">Download Datasets</a></li>
		{/if}
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
		/* height: 40px; */
		display: inline-block;
		margin: 0;
		padding: 0;
		border: 2px blue dotted;
		font-weight: bold;
	}

	li.search {
		padding: 0;
		margin: 0;
		/* width: 42px; */
		input {
			width: 42px !important;
			height: 36px;
			padding: 0;
			margin: 0;
			/* position: absolute; */
			/* top: 0; */
			/* left: 0; */
		}
/*
		input:hover, input:focus {
			width: 100% !important;
			position: absolute;
			top: 0;
			left: 0;
		} */
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
		}
	}
</style>
