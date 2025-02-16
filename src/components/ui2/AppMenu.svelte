<script lang="ts">
  import HamburgerButton from './HamburgerButton.svelte';
	import { clickOutside } from "$src/lib/svelte/clickOutside";

	const { mobile }: { mobile: boolean } = $props();

	let open = $state(false);
</script>

<div class="app-menu" class:mobile use:clickOutside={() => {open = false}}>
	<div class="hamburger" class:open>
		<HamburgerButton bind:open />
	</div>
	<ul class:open>
		<li><button>Search</button></li>
		<li><button>User Guide</button></li>
		<li><button>Download Datasets</button></li>
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
		/* display: flex; */
		list-style: none;
		margin: 0;
		padding: 0;
		border: 1px red solid;
	}

	li {
		display: inline-block;
		margin: 0;
		padding: 0;
		border: 1px blue dotted;
		font-weight: bold;
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

				button {
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
