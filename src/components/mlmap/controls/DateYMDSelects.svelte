<script lang="ts">
	import { binaryClosestTo } from "$src/lib/utils/arrays";
	import { daysInMonth, todayDate, parseUTC1700Date } from "$src/lib/utils/date";

	const { validDates, onDateSelect }: { validDates: Date[]; onDateSelect: (d: Date) => void } = $props();

	export function setDate(date: Date) {
		selectedYear = date.getFullYear();
		selectedMon = date.getMonth();
		selectedDay = date.getDate();
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

	let selectedYear: number = $state(todayDate.getUTCFullYear());
	let selectedMon: number = $state(todayDate.getUTCMonth());
	let selectedDay: number = $state(todayDate.getUTCDate());
	let selectedHour: number = $state(15); // Placeholder for time, if needed
	let selectedMinute: number = $state(20); // Placeholder for time, if needed
	let daysInSelectedMonth = $derived(daysInMonth(selectedYear, selectedMon));

	$effect(() => {
		const closestValid = binaryClosestTo(selectedDate(), validDates);
		if (closestValid) setDate(closestValid);
	});

	$effect(() => {
		onDateSelect?.(selectedDate());
	});

	export const selectedDate = () => parseUTC1700Date(`${selectedYear}-${selectedMon + 1}-${selectedDay}`); // new Date(Date.UTC(selectedYear, selectedMon, selectedDay));

	const monthThreeLetterNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
</script>

<div class="date-ymd-selects">
	<div class="container">
		<select class="year" style="width: 4rem;" bind:value={selectedYear}>
			{#each yearsArray as year}
				<option disabled={!isValidYear(year)} value={year}>{year}</option>
			{/each}
		</select>
		<select class="month" style="width: 3.25rem;" bind:value={selectedMon}>
			{#each monthThreeLetterNames as name, i}
				<option disabled={!isValidMonth(i)} value={i}>{name}</option>
			{/each}
		</select>
		<select class="day" style="width: 2.8rem;" bind:value={selectedDay}>
			{#each Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1) as day}
				<option class="has-data" disabled={!isValidDay(day)} value={day}>{day}</option>
			{/each}
		</select>

		<input class="time" type="text" style="width: 1.4rem;" bind:value={selectedHour} />
		<input class="time" type="text" style="width: 1.4rem;" bind:value={selectedMinute} />
	</div>
</div>

<style>
	.date-ymd-selects {
		position: absolute;
		display: flex;
		width: 100%;
		bottom: 40px;
		left: 0px;
		padding: 2px;
		padding-right: 3px;
		overflow: visible;
		justify-content: center;

		.container {
			display: flex;
			justify-content: center;
			width: auto;
			gap: 2px;
			background-color: white;
			border-radius: var(--border-radius);
			box-shadow: var(--box-shadow);
			padding: 2px;

			select {
				display: inline-block;
				height: 24px;
				font-size: 1rem;
				border-radius: 0px;
				padding: 0px;
				margin: 0px;

				option.has-data {
					font-weight: 700;
					color: var(--stjoe-blue);
				}

				option:disabled {
					display: none;
				}
			}
		}
	}
</style>
