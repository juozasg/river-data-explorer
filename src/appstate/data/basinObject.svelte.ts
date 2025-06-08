import { basinFeatureName, type BasinFeatureType } from "$src/appstate/data/basinFeatureCollection.svelte";
import { sites } from "$src/appstate/data/sites.svelte";
import { basinObjectTypeLabel } from "$src/lib/utils/prettyNames";

// export type BasinObjectType = 'site' | 'huc8' | 'huc10' | 'huc12' | 'state' | 'county' | 'river-catchment' | 'site-catchment'; // | 'custom';
export type BasinObjectType = Exclude<BasinFeatureType, 'river'>;

// basin features are geometries used for MLM map
// basin objects are logical objects that can be selected in the app and have data associated with them
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

	setNamedObject(objectType: 'huc8' | 'indiana' | 'michigan') {
		this.objectType = objectType == 'huc8' ? 'huc8' : 'state';


		this.id = objectType == 'huc8' ? 4050001 : objectType == 'indiana' ? 18 : 26;
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
		if (this.objectType === 'site') return `${sites.findById(this.id)?.name || ''}`;
		if (this.objectType === 'huc8') return `HUC8 ${this.id}`;
		if (this.objectType === 'huc10') return `HUC10 ${this.id}`;
		if (this.objectType === 'huc12') return `HUC12 ${this.id}`;
		if (this.objectType === 'state') return `State ${this.id}`;
		if (this.objectType === 'county') return `County ${this.id}`;
		if (this.objectType === 'river-catchment') return `${basinFeatureName('river', this.id)}`;
		if (this.objectType === 'site-catchment') return `${basinFeatureName('site-catchment', this.id)}`;
		return '';
	}

	get objectTypeLabel(): string {
		return basinObjectTypeLabel(this.objectType);
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
