<script lang="ts">
	import { fromZonedTime, getTimezoneOffset, toZonedTime } from "date-fns-tz";

	// import { binaryClosestTo } from "$src/lib/utils/arrays";
	import { daysInMonth, todayDate, parseUTC1700Date, dateSteps, type DateStep, nowRoundedToNearest15Minutes, availableYears, oldestDate } from "$src/lib/utils/date";

	import { onMount } from "svelte";
	import { defineGlobal } from "$src/lib/utils";

	const { validDates, onDateSelect }: { validDates: Date[]; onDateSelect: (d: Date) => void } = $props();

	let selectedDate = $state(new Date());

	onMount(() => {
		selectedDate = nowRoundedToNearest15Minutes();
		// console.log('onMount selectedDate', selectedDate.toISOString());

		updateDateEntry();

		// defineGlobal('fromZonedTime', fromZonedTime);
		// defineGlobal('toZonedTime', toZonedTime);
		// defineGlobal('getTimezoneOffset', getTimezoneOffset);
	});

	let selectedYear: number = $state(todayDate.getUTCFullYear());
	let selectedMon: number = $state(todayDate.getUTCMonth());
	let selectedDay: number = $state(todayDate.getUTCDate());
	let selectedHour: number = $state(7); // Placeholder for time, if needed
	let selectedMinute: number = $state(45); // Placeholder for time, if needed
	let daysInSelectedMonth = $derived(daysInMonth(selectedYear, selectedMon));

	let scrubAmount = $state<DateStep>("1y");

	export function setDate(date: Date) {
		// selectedYear = date.getFullYear();
		// selectedMon = date.getMonth();
		// selectedDay = date.getDate();
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


	$effect(() => {
		// console.log('FX selectedDate', selectedDate.toISOString());

		onDateSelect?.(new Date(selectedDate));
	});


	const monthThreeLetterNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	const dateEntryChanged = () => {
		const datetime = new Date(Date.UTC(selectedYear, selectedMon, selectedDay, selectedHour, selectedMinute, 0, 0));

		// datetime formatted with no 'Z' at the end
		const datetimeString = datetime.toISOString().replace("Z", "");
		const newDate = fromZonedTime(datetimeString, "US/Eastern"); // Convert to UTC date
		if (newDate > new Date()) {
			console.warn("Selected date is in the future, resetting to today");
			selectedDate = nowRoundedToNearest15Minutes();
			updateDateEntry();
		} else if (newDate < oldestDate) {
			console.warn("Selected date is too old, resetting to oldest date");
			selectedDate = oldestDate;
			updateDateEntry();
		}	else {
			selectedDate = newDate;
		}

		// console.log("dateEntryChanged", selectedDate.toISOString());
	};

	const timeEntryChanged = () => {
		if (selectedHour < 0 || selectedHour > 23 || selectedMinute < 0 || selectedMinute > 59) {
			console.warn("Invalid time entry");
			return;
		}

		dateEntryChanged();
	};

	const scrubOutOfRange = (left: boolean) => {
		const step = dateSteps[scrubAmount] * (left ? -1 : 1);
		const newDate = new Date(selectedDate.getTime() + step);
		// console.log('scrubOutOfRange', left, newDate.toISOString(), oldestDate.toISOString(), 'NOW: ', new Date().toISOString());

		if (newDate < oldestDate) {
			return true;
		} else if (newDate > new Date()) {
			return true;
		}

		return false;
	};

	let leftScrubDisabled = $derived(scrubOutOfRange(true));
	let rightScrubDisabled = $derived(scrubOutOfRange(false));

	const scrub = (left: boolean) => {
		if (scrubOutOfRange(left)) {
			console.warn("Scrub out of range, ignoring");
			return;
		}

		const step = dateSteps[scrubAmount] * (left ? -1 : 1);
		selectedDate = new Date(selectedDate.getTime() + step);

		// console.log("scrub", selectedDate.toISOString());
		updateDateEntry();
	};

	const updateDateEntry = () => {
		const zonedDatetime = toZonedTime(selectedDate, "US/Eastern");
		// console.log("updateDateEntry", selectedDate.toISOString(), zonedDatetime.toISOString().replace("Z", ""));

		selectedYear = zonedDatetime.getFullYear();
		selectedMon = zonedDatetime.getMonth();
		selectedDay = zonedDatetime.getDate();
		selectedHour = zonedDatetime.getHours();
		selectedMinute = zonedDatetime.getMinutes();
	};
</script>

<div class="date-ymd-selects">
	<div class="container">
		<select class="year" style="width: 4rem;" onchange={dateEntryChanged} bind:value={selectedYear}>
			{#each availableYears as year}
				<option class:no-data={!isValidYear(year)} value={year}>{year}</option>
			{/each}
		</select>
		<select class="month" style="width: 3.25rem;" onchange={dateEntryChanged} bind:value={selectedMon}>
			{#each monthThreeLetterNames as name, i}
				<option class:no-data={!isValidMonth(i)} value={i}>{name}</option>
			{/each}
		</select>
		<select class="day" style="width: 2.8rem;" onchange={dateEntryChanged} bind:value={selectedDay}>
			{#each Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1) as day}
				<option class:no-data={!isValidDay(day)} value={day}>{day}</option>
			{/each}
		</select>

		<input
			class="time hour"
			type="text"
			style="width: 1.4rem;"
			onchange={timeEntryChanged}
			oninput={timeEntryChanged}
			bind:value={selectedHour} />
		<input
			class="time minute"
			type="text"
			style="width: 1.4rem;"
			onchange={timeEntryChanged}
			oninput={timeEntryChanged}
			bind:value={selectedMinute} />
		<button class="scrub" id="scrub-left" disabled={leftScrubDisabled} style="width: 1.4rem;" onclick={() => scrub(true)}> &lt; </button>
		<select class="scrub" style="width: 2.8rem;" bind:value={scrubAmount}>
			<option value="15m">15m</option>
			<option value="1h">1h</option>
			<option value="3h">3h</option>
			<option value="6h">6h</option>
			<option value="12h">12h</option>
			<option value="1d">1d</option>
			<option value="7d">7d</option>
			<option value="30d">30d</option>
			<option value="90d">90d</option>
			<option value="180d">180d</option>
			<option value="1y">1y</option>
			<option value="5y">5y</option>
		</select>

		<button class="scrub" style="width: 1.4rem;" disabled={rightScrubDisabled} onclick={() => scrub(false)}> &gt; </button>

		<!-- <div>{selectedDate.toISOString()}</div> -->
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
				/* font-weight: 700; */
				/* color: var(--stjoe-blue); */

				option.no-data {
					color: #bbb;
					font-style: italic;
					font-style: italic;
				}

				option:disabled {
					display: none;
				}
			}

			input {
				height: 24px;
				text-align: center;
			}

			input.hour {
				margin-left: 6px;
			}

			button {
				height: 24px;
				padding: 2px;
				font-weight: 700;
				border-color: grey;
			}

			button[disabled] {
				opacity: 0.5;
				color: grey;
				cursor: default;
			}

			button#scrub-left {
				margin-left: 16px;
			}
		}
	}
</style>
