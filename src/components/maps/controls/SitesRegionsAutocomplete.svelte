<script lang="ts">
	// import ArrowDropRight from '$src/components/icons/ArrowDropRight.svelte';
	import AutoComplete from "simple-svelte-autocomplete";
	import { sites } from "$src/appstate/sites.svelte";
	import type { Site } from "$src/lib/types/site";
	import { onMount, untrack } from "svelte";
	import InlineBlockIconify from "./InlineBlockIconify.svelte";

	let {
		maxWidth = "100%",
		selectedSite,
		onSearchItemSelect
	}: { maxWidth?: string; selectedSite?: Site; onSearchItemSelect?: (item: Site) => void } = $props();

	let containerDiv = $state<HTMLDivElement>();
	const inputElement = $derived(
		containerDiv && (containerDiv.querySelector("input.autocomplete-input") as HTMLInputElement)
	);

	onMount(() => {
		// console.log("autocomplete mounted", containerDiv, inputElement);
		const selectOnFocus = () => inputElement?.select();
		inputElement?.addEventListener(`focus`, selectOnFocus);

		return () => {
			inputElement?.removeEventListener(`focus`, selectOnFocus);
		};
	});

	const onmouseleave = (e: MouseEvent) => {
		let esc = new KeyboardEvent("keydown", {
			key: "Escape"
		});
		inputElement?.dispatchEvent(esc);
	};

	const onmouseenter = (e: MouseEvent) => {
		// console.log("Mouse enter", e);
		inputElement?.click();
	};
	// $inspect('autocomplete selected site', selectedSite);

	$effect(() => {
		// console.log("autocomplete selected item", selectedSite);
		selectedSite;
		untrack(() => {
			if (onSearchItemSelect && selectedSite) {
				onSearchItemSelect(selectedSite);
			}
		});
		// if (onSearchItemSelect && selectedSite) {
		// 	onSearchItemSelect(selectedSite);
		// }
	});

	const itemSortFunction = (a: Site, b: Site) => {
		const dsComp = a.dataset.localeCompare(b.dataset);
		if (dsComp !== 0) return dsComp;
		return a.num - b.num;
	};
</script>

<div
	class="sites-regions-autocomplete"
	{onmouseleave}
	{onmouseenter}
	bind:this={containerDiv}>
	<!-- style="--maxWidth: {maxWidth}" -->
	<!-- items={sites.allEnabled.sort(itemSortFunction)} -->
	<AutoComplete
		items={sites.all}
		labelFieldName="id"
		valueFieldName="id"
		keywordsFunction={(s: Site) => s.name + " " + s.dataset + " " + s.num + " " + s.id + " site"}
		bind:selectedItem={selectedSite}
		placeholder="Search..."
		hideArrow={true}>
		<div slot="item" let:item={s}>
			<p><strong>Site</strong> <i class="siteid">{s.id}</i></p>
			<p>{s.name}</p>
			<!-- <span style="color:{item.code}">{item.code}</span> -->
		</div>
	</AutoComplete>
	<!-- <div class="bgicon"><InlineBlockIconify icon="gridicons:search" size="1.5rem" /></div> -->
</div>

<style>
	.sites-regions-autocomplete {
		padding: 0;
		margin: 0;
		/* position: fixed; */
		/* top: 0; */
		right: 400px;
		z-index: 1007;

		:global(& > .autocomplete) {
			width: 60px;
			min-width: 60px;
			&:hover {
				width: 370px;
				position: absolute;
			}
			/* max-width: 24rem; */
			/* position: relative; */
		}

		:global(.input-container) {
			height: 2.2rem;
			margin-top: 3px;
			:global(input) {
				border-radius: 3px !important;
			}
		}

		/* .bgicon {
			position: absolute;
			bottom: 5px;
			right: 10px;
			pointer-events: none;
			color: var(--color-darkGrey);
		} */

		/* :global(input.autocomplete-input) {
			padding: 0.5rem !important;
			margin: 0 !important;
			font-size: 1rem !important;
			border: none !important;

			&::placeholder {
				opacity: 0.7;
				color: var(--color-darkGrey);
			}
		} */

		/* :global(.autocomplete-list) {
			position: absolute;
			width: auto;
			max-width: calc(var(--maxWidth, 100%) - 60px);
			top: 2rem !important;
			border: none !important;
			border: 1px solid #ccc !important;

			padding: 0;

			font-size: 1rem;

			:global(.autocomplete-list-item) {
				padding: 0.3rem 0.4rem;
				margin: 0;
				border-bottom: 1px dotted #ddd;

				:global(p) {
					margin: 0;
					padding: 0;

					:global(strong) {
						font-size: 14px;
					}

					:global(.siteid) {
						font-size: 0.8em;
						color: var(--font-color) / 0.8;
					}
				}
			}

			:global(.autocomplete-list-item.confirmed) {
				background-color: var(--color-primary) !important;
				color: var(--font-color);
			}

			:global(.autocomplete-list-item.selected) {
				background-color: #f0f0f0;
				color: black;
			}
		}

		:global(.autocomplete.select) {
			width: 100%;
			max-width: 24rem;
			position: relative;
		} */
	}
</style>
