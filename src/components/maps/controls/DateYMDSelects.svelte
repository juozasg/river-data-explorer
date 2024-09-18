<script lang="ts">
		import { binaryClosestTo } from '$src/lib/utils/arrays';
	import { daysInMonth, UTCDayDate } from '$src/lib/utils/dates';

	const { validDates, onDateSelect }: { validDates: Date[]; onDateSelect: (d: Date) => void } = $props();

	export function setDate(date: Date) {
		selectedYear = date.getUTCFullYear();
		selectedMon = date.getUTCMonth();
		selectedDay = date.getUTCDate();
	}

	const validYears = $derived(Array.from(new Set(validDates.map((d) => d.getUTCFullYear()))));

	const isValidYear = (year: number) => validYears.includes(year);
	const isValidMonth = (mon: number) => {
		return validDates.some((d) => d.getUTCFullYear() === selectedYear && d.getUTCMonth() === mon);
	};

	const isValidDay = (day: number) => {
		return validDates.some(
			(d) => d.getUTCFullYear() === selectedYear && d.getUTCMonth() === selectedMon && d.getUTCDate() === day
		);
	};

	const yearsArray = $derived.by(() => {
		if (validDates.length === 0) return [1990];
		return [...new Set(validDates.map((d) => d.getUTCFullYear()))].sort();
	});

	let selectedYear: number = $state(UTCDayDate().getUTCFullYear());
	let selectedMon: number = $state(UTCDayDate().getUTCMonth());
	let selectedDay: number = $state(UTCDayDate().getUTCDate());
	let daysInSelectedMonth = $derived(daysInMonth(selectedYear, selectedMon));

	$effect(() => {
		const closestValid = binaryClosestTo(selectedDate(), validDates);
		if (closestValid) setDate(closestValid);
	});

	$effect(() => {
		onDateSelect?.(selectedDate());
	});

	export const selectedDate = () => new Date(Date.UTC(selectedYear, selectedMon, selectedDay));

	const monthThreeLetterNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
</script>

<div class="date-ymd-selects">
	<select style="width: 4rem;" bind:value={selectedYear}>
		{#each yearsArray as year}
			<option disabled={!isValidYear(year)} value={year}>{year}</option>
		{/each}
	</select>
	<select style="width: 3.25rem;" bind:value={selectedMon}>
		{#each monthThreeLetterNames as name, i}
			<option disabled={!isValidMonth(i)} value={i}>{name}</option>
		{/each}
	</select>
	<select style="width: 2.8rem;" bind:value={selectedDay}>
		{#each Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1) as day}
			<option disabled={!isValidDay(day)} value={day}>{day}</option>
		{/each}
	</select>
</div>

<style>
	.date-ymd-selects {
		position: absolute;
		display: inline-block;
		width: auto;
		top: 0px;
		right: 0px;
		padding: 2px;
		padding-right: 3px;
		overflow: visible;

		select {
			display: inline-block;
			height: 24px;
			font-size: 1rem;
			border-radius: 0px;
			padding: 0px;
			margin: 0px;

			option:disabled {
				display: none;
			}
		}
	}
</style>
