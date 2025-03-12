// hydrological rivers
export type River = {
	id: number;
	name: string;
	order: number;
	length: number; // km
	tributaryIds: number[];
	parentId: number;
};

// segmented by monitoring stations
export type RiverSection = {
	id: number;
	riverId: number; // hydrological river
	length: number; // km
	intakeSectionId: number;
	outletSectionId: number;
	tributarySectionIds: number[];
}

export const rivers: River[] = $state([]);