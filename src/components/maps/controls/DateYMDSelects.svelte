<script lang="ts">
	import { daysInMonth, UTCDayDate } from "$src/lib/utils";
	import { closestTo } from "date-fns";

	export function setSelectedDate(date: Date) {
		selectedYear = date.getUTCFullYear();
		selectedMon = date.getUTCMonth();
		selectedDay = date.getUTCDate();
	}

	const { validDates }: { validDates: Date[] } = $props();

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
		const closestValid = closestTo(selectedDate(), validDates);
		console.log("closestValid", closestValid);
		if (closestValid) setSelectedDate(closestValid);
	});

	export const selectedDate = () => new Date(Date.UTC(selectedYear, selectedMon, selectedDay));

	$effect(() => {
		if (selectedDay > daysInSelectedMonth) {
			selectedDay = daysInSelectedMonth;
		}
	});

	let monthsSelectEl = $state<HTMLSelectElement>();
	let daysSelectEl = $state<HTMLSelectElement>();

	const validateUserChange = () => {
		// closestValid = validDates.find((d) => d.getUTCFullYear() === selectedYear);
		// const selectedMonthOption = monthsSelectEl?.querySelector(
		// 	'option[value="' + selectedMon + '"]'
		// ) as HTMLOptionElement;
		// const selectedDayOption = daysSelectEl?.querySelector('option[value="' + selectedDay + '"]') as HTMLOptionElement;
		// // console.log('monsEl', monthsSelectEl, selectedMonthOption);
		// if (selectedMonthOption?.disabled || selectedDayOption?.disabled) {
		// 	const validDate = validDates.find((d) => d.getUTCFullYear() === selectedYear);
		// 	if (validDate) {
		// 		setSelectedDate(validDate);
		// 	}
		// }
	};

	const monthThreeLetterNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
</script>

<div class="date-selects">
	<select style="width: 4rem;" bind:value={selectedYear} onchange={validateUserChange}>
		{#each yearsArray as year}
			<option disabled={!isValidYear(year)} value={year}>{year}</option>
		{/each}
	</select>
	<select style="width: 3.25rem;" bind:value={selectedMon} onchange={validateUserChange} bind:this={monthsSelectEl}>
		{#each monthThreeLetterNames as name, i}
			<option disabled={!isValidMonth(i)} value={i}>{name}</option>
		{/each}
	</select>
	<select style="width: 2.8rem;" bind:value={selectedDay} bind:this={daysSelectEl}>
		{#each Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1) as day}
			<option disabled={!isValidDay(day)} value={day}>{day}</option>
		{/each}
	</select>
</div>

<style>
	.date-selects {
		position: absolute;
		display: inline-block;
		width: auto;
		/* width: 180px; */
		top: 0px;
		right: 0px;
		padding: 2px;
		padding-right: 3px;
		/* height: 30px; */
		overflow: visible;

		select {
			display: inline-block;
			height: 24px;
			font-size: 1rem;
			/* border: 1px solid hsl(0, 0%, 46%); */
			/* border: none; */
			border-radius: 0px;
			padding: 0px;
			margin: 0px;

			option:disabled {
				display: none;
			}
		}
	}
</style>
