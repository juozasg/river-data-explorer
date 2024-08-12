<script lang="ts">
	import * as aq from 'arquero';
	import { scaleLinear } from 'd3-scale';
	import { Html, LayerCake, Svg } from 'layercake';

	import { variableMetadata } from '$src/appstate/variableMetadata';

	import type { Site } from '$lib/types/site';
	import { sitesTables } from '$src/appstate/data/datasets.svelte';
	import { sites, Sites } from '$src/appstate/sites.svelte';
	import AxisX from '$src/components/chart/layercake/AxisX.svelte';
	import AxisY from '$src/components/chart/layercake/AxisY.svelte';
	import AxisYZRight from '$src/components/chart/layercake/AxisYZRight.svelte';
	import Brush from '$src/components/chart/layercake/Brush.html.svelte';
	import Line from '$src/components/chart/layercake/Line.svelte';
	import Scatter from '$src/components/chart/layercake/Scatter.svelte';
	import SharedTooltip from '$src/components/chart/layercake/SharedTooltip.svelte';
	import { simpleStats } from '$src/lib/data/stats';
	import { aremove, fmtDate, niceTickNumber } from '$src/lib/utils';
	import type ColumnTable from 'arquero/dist/types/table/column-table';
	import { genXDateTicks, genYTicks } from '$src/lib/utils/chart';

	let tableDataset: string = $state('sjrbc');
	let tableNum: number = $state(1);

	const tableName = $derived(`${tableDataset}-${tableNum}`);
	let yVar: string = $state('bod');
	let zVar: string = $state('bodPercent');

	const yVarUnit = $derived(variableMetadata[yVar]?.unit || '');
	const zVarUnit = $derived(variableMetadata[zVar]?.unit || '');

	const unitLabelParens = (unit: string) => (unit ? ` (${unit})` : '');

	const yVarlabel = $derived(
		variableMetadata[yVar]?.label + ` ${unitLabelParens(yVarUnit)}` || yVar
	);
	const zVarlabel = $derived(
		variableMetadata[zVar]?.label + ` ${unitLabelParens(zVarUnit)}` || zVar
	);
</script>
