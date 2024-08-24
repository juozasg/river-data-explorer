<script lang="ts">
	import { fmtDate, fmtDateValue, fmtDateYmd } from '$src/lib/utils';

	// const startDate = new Date('2015-12-30');

	const {
		startDate = new Date('2015-12-30'),
		endDate = new Date(),
		onChange
	}: { startDate: Date; endDate: Date; onChange: (date: Date) => void } = $props();

</script>

<div class="date-selects">
	<select style="width: 4rem;">
		<option value="2001">2901</option>
		<option value="2002">2902</option>
		<option value="2003">2903</option>
		<option value="2004">2904</option>
		<option value="2005">2905</option>
		<option value="2006">2906</option>
		<option value="2007">2907</option>
		<option value="2008">2908</option>
		<option value="2009">2909</option>
		<option value="2010">2910</option>
		<option value="2011">2911</option>
		<option value="2012">2912</option>
	</select>
	<select style="width: 3.25rem;">
		<option value="1">Jan</option>
		<option value="2">02</option>
		<option value="3">03</option>
		<option value="4">04</option>
		<option value="5">05</option>
		<option value="6">06</option>
		<option value="7">07</option>
		<option value="8">08</option>
		<option value="9">09</option>
		<option value="10">10</option>
		<option value="11">11</option>
		<option value="12">12</option>
	</select>
	<select style="width: 2.8rem;">
		<option value="1">01</option>
		<option value="2">02</option>
		<option value="3">03</option>
		<option value="4">04</option>
		<option value="5">05</option>
		<option value="6">06</option>
		<option value="7">07</option>
		<option value="8">08</option>
		<option value="9">09</option>
		<option value="10">10</option>
		<option value="11">11</option>
		<option value="12">12</option>
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
