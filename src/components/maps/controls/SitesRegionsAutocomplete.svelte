<script lang="ts">
	// import ArrowDropRight from '$src/components/icons/ArrowDropRight.svelte';
	import AutoComplete from "simple-svelte-autocomplete";
	import { sites } from "$src/appstate/sites.svelte";
	import type { Site } from "$src/lib/types/site";

	let {
		maxWidth = "100%",
		selectedSite,
		searchItemSelect
	}: { maxWidth?: string; selectedSite?: Site; searchItemSelect?: (item: Site) => void } = $props();

	let containerDiv = $state<HTMLDivElement>();
	const inputElement = $derived(
		containerDiv && (containerDiv.querySelector("input.autocomplete-input") as HTMLInputElement)
	);

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

	$effect(() => {
		console.log("autocomplete selected item", selectedSite);
		if (searchItemSelect && selectedSite) {
			searchItemSelect(selectedSite);
		}
	});

	const itemSortFunction = (a: Site, b: Site) => {
		const dsComp = a.dataset.localeCompare(b.dataset)
		if(dsComp !== 0) return dsComp;
		return a.num - b.num;
	};
</script>

<div
	class="sites-regions-autocomplete"
	{onmouseleave}
	{onmouseenter}
	bind:this={containerDiv}
	style="--maxWidth: {maxWidth}">
	<AutoComplete
		items={sites.allEnabled.sort(itemSortFunction)}
		labelFieldName="id"
		valueFieldName="id"
		keywordsFunction={(s: Site) => s.name + " " + s.dataset + " " + s.num + " " + s.id + " site"}
		bind:selectedItem={selectedSite}
		placeholder="Search sites..."
		hideArrow={true}>
		<div slot="item" let:item={s}>
			<p><strong>Site</strong> <i class="siteid">{s.id}</i></p>
			<p>{s.name}</p>
			<!-- <span style="color:{item.code}">{item.code}</span> -->
		</div>
	</AutoComplete>
</div>

<style>
	.sites-regions-autocomplete {
		:global(.autocomplete.select) {
			:global(::-webkit-scrollbar) {
				-webkit-appearance: none;
			}

			:global(::-webkit-scrollbar:vertical) {
				width: 10px;
			}


			:global(::-webkit-scrollbar-thumb) {
				border-radius: 8px;
				border: 2px solid white; /* should match background, can't be transparent */
				background-color: rgba(0, 0, 0, 0.5);
			}

			margin-left: 14px;
			padding-top: 1rem;
			padding-right: 1rem;
			padding-bottom: 0.5rem;

			max-width: 24rem;
			position: relative;

			:global(.autocomplete-list) {
				position: absolute;
				width: auto;
				max-width: calc(var(--maxWidth, 100%) - 68px);
				top: 48px !important;

				padding: 0;

				font-size: 1em;

				:global(.autocomplete-list-item) {
					padding: 0.6rem 0.7rem;
					margin: 0;
					/* margin-left: 0./5rem; */
					/* margin-right: 0.5rem; */

					:global(p) {
						margin: 0;
						padding: 0;

						:global(strong) {
							font-size: 14px;
						}

						:global(.siteid) {
							font-size: 0.8em;
							color: #666;
						}
					}
				}

				:global(.autocomplete-list-item.selected) {
					background-color: #f0f0f0;
					color: black;
				}
			}
		}
	}
</style>
