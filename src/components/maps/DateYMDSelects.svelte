<script lang="ts">
	import { daysInMonth, fmtDate, fmtDateValue, fmtDateYmd } from '$src/lib/utils';

	// const startDate = new Date('2015-12-30');

	const {
		startDate = new Date('2015-12-30'),
		endDate = new Date(),
		onChange
	}: { startDate: Date; endDate: Date; onChange: (date: Date) => void } = $props();

	const startYear = $derived(startDate.getFullYear());
	const endYear = $derived(endDate.getFullYear());
	const yearsArray = $derived(
		Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)
	);

	let selectedYear: number = $state(2020);
	let selectedMon: number = $state(1);
	let selectedDay: number = $state(1);
	let daysInSelectedMonth = $derived(daysInMonth(selectedYear, selectedMon));

	$effect(() => {
		selectedYear = endYear;
		selectedMon = endDate.getMonth() + 1;
		selectedDay = endDate.getDate();
	});

	$effect(() => {
		if(selectedDay > daysInSelectedMonth) {
			selectedDay = daysInSelectedMonth;
		}
	});

	$effect(() => {
		// console.log('startYear', startDate);
		// console.log('endYear', endDate);
		console.log(selectedYear, selectedMon, selectedDay, daysInSelectedMonth);
	});
</script>

<div class="date-selects">
	<select style="width: 4rem;" bind:value={selectedYear}>
		{#each yearsArray as year}
			<option value={year}>{year}</option>
		{/each}
	</select>
	<!-- <select style="width: 3.25rem;" bind:value={selectedMon}> -->
	<select style="width: 3.25rem;" bind:value={selectedMon}>
		<option value={1}>Jan</option>
		<option value={2}>Feb</option>
		<option value={3}>Mar</option>
		<option value={4}>Apr</option>
		<option value={5}>May</option>
		<option value={6}>Jun</option>
		<option value={7}>Jul</option>
		<option value={8}>Aug</option>
		<option value={9}>Sep</option>
		<option value={10}>Oct</option>
		<option value={11}>Nov</option>
		<option value={12}>Dec</option>
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
		right: 6px;

		select {
			width: 60px;
			height: 30px;
			font-size: 1rem;
			border: 1px solid hsl(0, 0%, 46%);
			border-radius: 4px;
			padding: 0px;
			margin: 0px;
		}
	}
</style>
