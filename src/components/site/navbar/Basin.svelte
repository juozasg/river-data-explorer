<script lang="ts">
	// import Dropdown from './Dropdown.svelte';
	// import NavbarItem from './Item.svelte';

	import DropdownItem from "./DropdownItem.svelte";

	const counties = [
		"Berrien",
		"Branch",
		"Steuben"
	];

	const huc10s = [
		"Coldwater River",
		"Headwaters Saint Joseph River",
		"Dowagiac River",
	];
	// 0405000101,Coldwater River,765.09,"18,26"
	// 0405000102,Headwaters Saint Joseph River,573.87,26
	// 0405000123,Dowagiac River,733.81,26

</script>




<DropdownItem>
	{@render link("Basin")}
	<div class="navbar-dropdown is-boxed">
		{@render item("Indiana")}
		{@render item("Michigan")}
		<DropdownItem>
			{@render link("Counties")}
			{@render dropdownBox(counties)}
		</DropdownItem>

		<DropdownItem>
			{@render link("Rivers")}
			{@render dropdownBox(huc10s)}
		</DropdownItem>

		{@render item("HUC12")}
		<hr class="navbar-divider">
		{@render item("Search")}
	</div>
</DropdownItem>


{#snippet dropdownBox(sublabels)}
	<div class="navbar-dropdown is-boxed">
			{#each sublabels as label}
				{@render item(label)}
			{/each}
	</div>
{/snippet}


{#snippet item(label)}
	<a class="navbar-item">
		{label}
	</a>
{/snippet}

{#snippet link(label)}
	<a class="navbar-link">
		{label}
	</a>
{/snippet}
