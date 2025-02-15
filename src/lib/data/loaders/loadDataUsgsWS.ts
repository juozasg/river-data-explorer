import * as aq from 'arquero';

import { startedLoading } from "$src/appstate/ui/loadingItem.svelte";
import { notify } from "$src/appstate/ui/notifications.svelte";
// import { strftime } from "$lib/utils/strftime";
// import { oneMonthAgo } from "$lib/utils";
// import { usgsStationIds } from "./loadSitesUsgsWS";
import { sitesTables, type SiteId } from "$src/appstate/data/datasets.svelte";
import { variablesMetadata, type VariablesMetadata } from '$src/appstate/variablesMetadata.svelte';
import { retryingFetch } from '$src/lib/utils/retryingFetch';
import { parseUTC1700Date } from '$src/lib/utils/date';

export async function loadDatasetsUsgsWS() {
	const finishedLoading = startedLoading("USGS Datasets");
	// TODO: import realtime data as separate variable
	// const monthAgoDate = strftime('%F', new Date(oneMonthAgo()));
	// const ivUrl = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${usgsStationIds}&parameterCd=00060,00065&siteStatus=all&startDT=${monthAgoDate}&endDT=${nowDate}`;
	// Example: https://waterservices.usgs.gov/nwis/iv/?format=json&sites=04096405&parameterCd=00060,00065&siteStatus=all&startDT=2024-07-30&endDT=2024-07-31

	// const startDate = '2000-01-01';
	// const nowDate = strftime('%F', new Date(Date.now()));

	// https://waterservices.usgs.gov/nwis/iv/?format=json&sites=04096405&parameterCd=00060,00065&siteStatus=all&startDT=2024-07-30&endDT=2024-07-31
	// https://waterservices.usgs.gov/nwis/dv/?format=json&sites=04096405&parameterCd=00065,00060&statCd=00003&siteStatus=all&startDT=2024-07-30&endDT=2024-08-11
	// https://waterservices.usgs.gov/nwis/dv/?format=json&sites=04096405,04096515,04097500,040975299,04097540,04099000,04100500,04101000,04101500,04101800,04102500,04099750&parameterCd=00065,00060&statCd=00003&siteStatus=all&startDT=2024-07-30&endDT=2024-08-11
	// const dailiesUrl = 'https://waterservices.usgs.gov/nwis/dv/?format=json&sites=04096405&statCd=00003&siteStatus=all&startDT=2024-07-30&endDT=2024-07-31';
	// const dailiesUrl = `https://waterservices.usgs.gov/nwis/dv/?format=json&sites=${usgsStationIds}&statCd=00003&siteStatus=all&startDT=${startDate}&endDT=${nowDate}`;


	const dailiesUrl = 'https://water.teamhephy.info/data';
	try {
		const usgsDailies = await retryingFetch(dailiesUrl);
		// return;
		const dailies = await usgsDailies.json();
		const usgsSiteTimeseries = dailies.value.timeSeries;

		// console.log('usgsSiteTimeseries', usgsSiteTimeseries);
		usgsTimeseriesToSiteTables(usgsSiteTimeseries);
	} catch (error) {
		console.error('Error loading USGS sites', error);
		notify(`Error loading USGS sites ${dailiesUrl}`, 'error', 6000);
	} finally {
		finishedLoading();
	}
}


function usgsTimeseriesToSiteTables(timeSeries: any) {
	type DateTimeString = string;
	const siteDateValues: Record<SiteId, Record<DateTimeString, any>> = {};

	for (const ts of timeSeries) {
		const siteCode = ts.sourceInfo.siteCode[0].value;
		const siteId = `usgs-${siteCode}`;
		const usgsVarname: string = ts.variable.variableName || '';
		const sjriverVarname = usgsVarnameToSjriverVarname(usgsVarname);

		if (!sjriverVarname) {
			console.log('Unknown USGS variable', usgsVarname);
			continue;
		}

		if (!variablesMetadata[sjriverVarname]) {
			console.log('Unsupported variable. Add to variables.yaml', sjriverVarname);
			continue;
		}

		type UsgsTSPoint = { dateTime: string, value: string, qualifiers: string[] };
		const usgsVarTimeseries: UsgsTSPoint[] = ts.values[0].value;
		for (const tsPoint of usgsVarTimeseries) {
			const d = tsPoint.dateTime;
			const v = parseFloat(tsPoint.value);

			if (!siteDateValues[siteId]) siteDateValues[siteId] = {};
			if (!siteDateValues[siteId][d]) siteDateValues[siteId][d] = {};
			siteDateValues[siteId][d][sjriverVarname] = v;

			siteDateValues[siteId][d]['date'] =  parseUTC1700Date(d);
			// siteDateValues[siteId][d]['date'] =  new Date();
		}
	}
	for (const [siteId, dateValues] of Object.entries(siteDateValues)) {
		const records = Object.entries(dateValues).map(([, v]) => v);
		const table = aq.from(records).orderby('date').reify();
		sitesTables.set(siteId, table);
		// console.log('usg site table sample', siteId, table.sample(5).objects());
	}
}


function usgsVarnameToSjriverVarname(usgsVarname: string) {
	if (usgsVarname.indexOf('Streamflow') == 0) {
		return 'flow';
	} else if (usgsVarname.indexOf('Gage height') == 0) {
		return 'height';
	} else if (usgsVarname.indexOf('Temperature') == 0) {
		return 'temp';
	} else if (usgsVarname.indexOf('Specific conductance') == 0) {
		return 'spc';
	} else if (usgsVarname.indexOf('Dissolved oxygen') == 0) {
		return 'do';
	}
}