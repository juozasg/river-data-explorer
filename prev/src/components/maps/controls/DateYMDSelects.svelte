<script lang="ts">
	import { daysInMonth, seqid } from '$src/lib/utils';

	export function setYMD(year: number, mon: number, day: number) {
		console.log('setYMD', year, mon, day);
		selectedYear = year;
		selectedMon = mon;
		selectedDay = day;
	}

	const { startDate, endDate, validDates }: { startDate: Date; endDate: Date; validDates: Date[] } =
		$props();

	const validYears = $derived(Array.from(new Set(validDates.map((d) => d.getUTCFullYear()))));

	const isValidYear = (year: number) => validYears.includes(year);
	const isValidMonth = (mon: number) => {
		return validDates.some((d) => d.getUTCFullYear() === selectedYear && d.getUTCMonth() === mon);
	};

	const isValidDay = (day: number) => {
		return validDates.some(
			(d) =>
				d.getUTCFullYear() === selectedYear &&
				d.getUTCMonth() === selectedMon &&
				d.getUTCDate() === day
		);
	};

	// $effect(() => {
	// 	console.log(' ---> DateYMDSelects startDate ', startDate.toISOString(), 'endDate', endDate.toISOString());
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

	let monthsSelectEl = $state<HTMLSelectElement>();
	let daysSelectEl = $state<HTMLSelectElement>();

	const validateUserChange = () => {
		const selectedMonthOption = monthsSelectEl?.querySelector('option[value="' + selectedMon + '"]') as HTMLOptionElement;
		const selectedDayOption = daysSelectEl?.querySelector('option[value="' + selectedDay + '"]') as HTMLOptionElement;
		// console.log('monsEl', monthsSelectEl, selectedMonthOption);
		if (selectedMonthOption?.disabled || selectedDayOption?.disabled) {
			const validDate = validDates.find((d) => d.getUTCFullYear() === selectedYear)
			if (validDate) {
				setSelectedDate(validDate);
			}
		}
	};

	const monthThreeLetterNames = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];
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

			option:disabled {
				display: none;
			}
		}
	}
</style>
