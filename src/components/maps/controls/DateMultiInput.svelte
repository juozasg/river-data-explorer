<script lang="ts">
	import DateSliderInput from "./DateSliderInput.svelte";
	import DateYMDSelects from "./DateYMDSelects.svelte";
	import {  binaryClosestSearch, UTCDayDate } from "$src/lib/utils";

	let { validDates, vardate = $bindable(UTCDayDate()) }: { validDates: Date[]; vardate: Date } = $props();
	const validValues = $derived((validDates || []).map((d) => d.valueOf()));


	// const validDateValues = $derived((validDates || []).map((d) => d.valueOf()));

	// const startDate = $derived(validDates[0] || UTCDayDate("1990-01-01"));
	// const endDate = $derived(validDates[validDates.length - 1] || UTCDayDate());

	// could be cleaner later
	export function setInternalDate(d: Date) {
		// rangeInputValue = d.valueOf();
	}

	let dateSliderInput = $state<DateSliderInput>();
	let ymdSelects = $state<DateYMDSelects>();

	const onYmdDateSelect = (date: Date) => {
		console.log("multinput ymdDateSelect", date);
		const closestValue = binaryClosestSearch(validValues, date.valueOf());

		if(date.valueOf() === closestValue) {
			console.log('set slider date', date.toISOString());
			dateSliderInput?.setDate(date);
		}
	};

	const onRangeDateSelect = (date: Date) => {
		console.log("multinput rangeDateSelect", date);
		const closestValue = binaryClosestSearch(validValues, date.valueOf());

		if(date.valueOf() === closestValue) {
			console.log('set ymd date', date.toISOString());
			ymdSelects?.setDate(date);
		}
	};
</script>

{#if validDates.length > 0}
	<div class="map-control">
		<DateSliderInput {validDates} onDateSelect={onRangeDateSelect} bind:this={dateSliderInput} />
		<DateYMDSelects {validDates} onDateSelect={onYmdDateSelect} bind:this={ymdSelects} />
	</div>
{/if}

<style>
	.map-control {
		z-index: 1000;
		position: absolute;
		bottom: 0px;
		left: 0px;
		width: calc(100% - 20px);
		height: 29px;

		padding: 0;
		margin: 10px;

		border-radius: var(--border-radius);
		background-color: hsl(0, 0%, 100%);
		border: none !important;
		color: hsl(0, 0%, 21%);
	}
</style>
