import { basinFeatureName, type BasinFeatureType } from "$src/appstate/data/basinFeatureCollection.svelte";
import { sites } from "$src/appstate/data/sites.svelte";
import { allVariableStats, allVarsDailyMedians, sitesDataStats } from "$src/lib/data/stats";
import type { VariableStats } from "$src/lib/types/analysis";
import { basinObjectTypeLabel } from "$src/lib/utils/prettyNames";
import type ColumnTable from "arquero/dist/types/table/column-table";
import { siteDatasets } from "./datasets.svelte";
import { sitesInRegion } from "./geoindexes.svelte";
import { selectTableVar } from "$src/lib/data/siteTableHelpers";

// export type BasinObjectType = 'site' | 'huc8' | 'huc10' | 'huc12' | 'state' | 'county' | 'river-catchment' | 'site-catchment'; // | 'custom';
export type BasinObjectType = Exclude<BasinFeatureType, 'river'>;

// basin features are geometries used for MLM map
// basin objects are logical objects that can be selected in the app and have data associated with them
export class BasinObject {
	objectType: BasinObjectType | undefined = $state();
	id: number | undefined = $state();
	readonly #target: '1' | '2' | undefined;

	constructor(target?: '1' | '2') {
		this.#target = target;
	}

	selectedCallback: ((target: '1' | '2' | undefined, objectType: BasinObjectType | undefined, id: number | undefined) => void) | undefined = undefined;

	clear() {
		this.objectType = undefined;
		this.id = undefined;
		if (this.selectedCallback) {
			this.selectedCallback(this.#target, undefined, undefined);
		}
	}

	set(objectType: BasinObjectType, id: number) {
		this.objectType = objectType;
		this.id = id;
		if (this.selectedCallback) {
			this.selectedCallback(this.#target, objectType, id);
		}
	}

	setNamedObject(objectType: 'huc8' | 'indiana' | 'michigan') {
		this.objectType = objectType == 'huc8' ? 'huc8' : 'state';
		this.id = objectType == 'huc8' ? 4050001 : objectType == 'indiana' ? 18 : 26;
		if (this.selectedCallback) {
			this.selectedCallback(this.#target, this.objectType, this.id);
		}
	}

	equals(other: BasinObject): boolean {
		if (this.objectType !== other.objectType) return false;
		if (this.id !== other.id) return false;
		return true;
	}

	get isSet(): boolean {
		if (this.objectType === undefined || this.id === undefined) return false;
		return true;
	}

	get objectLabelName(): string {
		if (this.objectType === undefined || this.id === undefined) return '';
		return basinFeatureName(this.objectType as BasinFeatureType, this.id, false);
	}

	get objectSiteId(): string | undefined {
		if (!this.id) return;

		if (this.objectType === 'site' || this.objectType === 'site-catchment') {
			// const otype = 'site';

			return sites.get(this.id)?.siteId; // this is the siteId

		}
	}

	get objectTypeLabel(): string {
		return basinObjectTypeLabel(this.objectType);
	}


	get allVariableStats(): VariableStats[] {
		if (!this.isSet) return [];
		switch (this.objectType) {
			case 'site':
				const table = siteDatasets.get(this.id!);
				if (!table) return [];

				return allVariableStats(table!);
			case 'huc8':
			case 'huc10':
			case 'huc12':
			case 'state':
			case 'county':
			case 'river-catchment':
			case 'site-catchment':
				const sites = sitesInRegion(this.objectType, this.id!);
				// const sitesStats = sitesDataStats(sites);
				const tables = sites.map((s) => siteDatasets.get(s.id)).filter((t) => t) as ColumnTable[];

				const dailyMedians = allVarsDailyMedians(tables);

				return allVariableStats(dailyMedians, {
					errorLabel: sites.map((s) => s.siteId).join(", ")
				});

			default:
				return [];
		}
	}

	variableTable(varname: string): ColumnTable | undefined {
		switch (this.objectType) {
			case 'site':
				const table = siteDatasets.get(this.id!);
				return table ? table.select('date', varname) : undefined;

			// return allVariableStats(table!);
			case 'huc8':
			case 'huc10':
			case 'huc12':
			case 'state':
			case 'county':
			case 'river-catchment':
			case 'site-catchment':
				return
				// const tables = siteTablesForRegion(_sites.allEnabled, dataSelection.yRegion);
				// const dailyMediansTable = varDailyMedian(tables, dataSelection.yVar);
				// // console.log('dailyMediansTable', dailyMediansTable.objects());
				// return selectTableVar(dailyMediansTable, dataSelection.yVar, "y");

			default:
				return;
		}

	}
}

export class BasinObjectVariable {
	basinObject: BasinObject = new BasinObject();
	varname: string | undefined = $state();
	readonly axis: 'y' | 'z' | undefined = $state(); // x or y axis variable

	constructor(axis?: 'y' | 'z') {
		this.axis = axis;
	}

	table(): ColumnTable | undefined {
		if (!this.isSet()) return;
		if (!this.varname) return;
		const table = this.basinObject.variableTable(this.varname);
		return selectTableVar(table, this.varname, this.axis);
	}

	clear() {
		this.basinObject.clear();
		this.varname = undefined;
	}

	set(basinObject: BasinObject, varname: string) {
		this.basinObject.set(basinObject.objectType!, basinObject.id!);
		this.varname = varname;
	}

	isSet(): boolean {
		if (!this.basinObject.isSet) return false;
		if (this.varname === undefined) return false;
		return true;
	}

	equals(other: BasinObjectVariable): boolean {
		if (!this.basinObject.equals(other.basinObject)) return false;
		if (this.varname !== other.varname) return false;
		return true;
	}
}
