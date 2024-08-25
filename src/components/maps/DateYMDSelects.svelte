<script lang="ts">
	import { daysInMonth } from '$src/lib/utils';

	export function setYMD(year: number, mon: number, day: number) {
		console.log('setYMD', year, mon, day);
		selectedYear = year;
		selectedMon = mon;
		selectedDay = day;
	}

	const {
		startDate,
		endDate
	}: { startDate: Date; endDate: Date; } = $props();

	$effect(() => {
		console.log(' ---> DateYMDSelects startDate ', startDate.toISOString(), 'endDate', endDate.toISOString());
	});


	// $effect(() => {
	// 	console.log('*** selectedDate UPDATED', 'selected', selectedDate, 'START -', startDate, ' END - ', endDate);
	// 	if (selectedDate < startDate) {
	// 		console.log('** selectedDate < startDate');
	// 		selectedYear = startDate.getUTCFullYear();
	// 		selectedMon = startDate.getUTCMonth();
	// 		selectedDay = startDate.getUTCDate();
	// 	} else if (selectedDate > endDate) {
	// 		console.log('** selectedDate > endDate');
	// 		selectedYear = endDate.getUTCFullYear();
	// 		selectedMon = endDate.getUTCMonth();
	// 		selectedDay = endDate.getUTCDate();
	// 	}
	// });

	const startYear = $derived(startDate.getUTCFullYear());
	const endYear = $derived(endDate.getUTCFullYear());
	const yearsArray = $derived(
		Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)
	);

	let selectedYear: number = $state(endDate.getUTCFullYear());
	let selectedMon: number = $state(endDate.getUTCMonth());
	let selectedDay: number = $state(endDate.getUTCDate());
	let daysInSelectedMonth = $derived(daysInMonth(selectedYear, selectedMon));

	export const selectedDate: Date = $derived(
		new Date(Date.UTC(selectedYear, selectedMon, selectedDay))
	);

	export function setSelectedDate(date: Date) {
		selectedYear = date.getUTCFullYear();
		selectedMon = date.getUTCMonth();
		selectedDay = date.getUTCDate();
	}


	$effect(() => {
		if (selectedDay > daysInSelectedMonth) {
			selectedDay = daysInSelectedMonth;
		}
	});
</script>

<div class="date-selects">
	<select style="width: 4rem;" bind:value={selectedYear}>
		{#each yearsArray as year}
			<option value={year}>{year}</option>
		{/each}
	</select>
	<select style="width: 3.25rem;" bind:value={selectedMon}>
		<option value={0}>Jan</option>
		<option value={1}>Feb</option>
		<option value={2}>Mar</option>
		<option value={3}>Apr</option>
		<option value={4}>May</option>
		<option value={5}>Jun</option>
		<option value={6}>Jul</option>
		<option value={7}>Aug</option>
		<option value={8}>Sep</option>
		<option value={9}>Oct</option>
		<option value={10}>Nov</option>
		<option value={11}>Dec</option>
	</select>
	<select style="width: 2.8rem;" bind:value={selectedDay}>
		{#each Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1) as day}
			<option value={day}>{day}</option>
		{/each}
	</select>
</div>

<style>
	.date-selects {
		position: absolute;
		display: inline-block;
		width: 180px;
		top: 5px;
		right: -4px;
		/* height: 30px; */

		select {
			width: 60px;
			height: 28px;
			font-size: 1rem;
			border: 1px solid hsl(0, 0%, 46%);
			border-radius: 4px;
			padding: 0px;
			margin: 0px;
		}
	}
</style>
