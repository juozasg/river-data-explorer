import { riverappFeatureName } from "../data/riverappFeatureCollection.svelte";
import { setMapMaximized } from "../ui/layout.svelte";

export type BasinObjectType = 'site' | 'huc8' | 'huc10' | 'huc12' | 'state' | 'county' | 'river-catchment' | 'site-catchment'; // | 'custom';

export class BasinObject {
	objectType: BasinObjectType | undefined = $state();
	id: number | undefined = $state();

	clear() {
		this.objectType = undefined;
		this.id = undefined;
	}

	set(objectType: BasinObjectType, id: number) {
		this.objectType = objectType;
		this.id = id;
	}

	equals(other: BasinObject): boolean {
		if (this.objectType !== other.objectType) return false;
		if (this.id !== other.id) return false;
		return true;
	}

	get isSelected(): boolean {
		if (this.objectType === undefined || this.id === undefined) return false;
		return true;
	}

	get objectLabel(): string {
		if (this.objectType === undefined || this.id === undefined) return '';
		if (this.objectType === 'site') return `Site ${this.id}`;
		if (this.objectType === 'huc8') return `HUC8 ${this.id}`;
		if (this.objectType === 'huc10') return `HUC10 ${this.id}`;
		if (this.objectType === 'huc12') return `HUC12 ${this.id}`;
		if (this.objectType === 'state') return `State ${this.id}`;
		if (this.objectType === 'county') return `County ${this.id}`;
		if (this.objectType === 'river-catchment') return `${riverappFeatureName('rivers', this.id)}`;
		if (this.objectType === 'site-catchment') return `${riverappFeatureName('site-catchments', this.id)}`;
		return '';
	}
}

export class BasinObjectVariable {
	basinObject: BasinObject = new BasinObject();
	varname: string | undefined = $state();

	clear() {
		this.basinObject.clear();
		this.varname = undefined;
	}
	set(basinObject: BasinObject, varname: string) {
		this.basinObject = basinObject;
		this.varname = varname;
	}

	equals(other: BasinObjectVariable): boolean {
		if (!this.basinObject.equals(other.basinObject)) return false;
		if (this.varname !== other.varname) return false;
		return true;
	}
}

export const basinObject1 = new BasinObject();
export const basinObject2 = new BasinObject();


export const chartYSelection = new BasinObjectVariable();
export const chartZSelection = new BasinObjectVariable();


export type MapSelectionMode = 'auto' | 'site' | 'huc10' | 'huc12' | 'county' | 'river-catchment' | 'site-catchment'; // | 'custom-click' | 'custom-draw';

// when mode is 'auto', target is picked based on emptiness of data1 or data2 and the hovered region
export const mapSelectionMode = $state({
	mode: 'auto' as MapSelectionMode,
	target: '1' as '1' | '2',
});

export const mapSelectionTargetObject = () =>  mapSelectionMode.target === '1' ? basinObject1 : basinObject2;

