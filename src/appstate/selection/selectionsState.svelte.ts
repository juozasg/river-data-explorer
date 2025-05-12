
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

	isSelected(): boolean {
		if (this.objectType === undefined || this.id === undefined) return false;
		return true;
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




