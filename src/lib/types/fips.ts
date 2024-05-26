export enum StateFips {
	Indiana = 18,
	Michigan = 26,
	UnknownState = 99
};

export enum CountyFips {
	Berrien = 26021,
	Branch = 26023,
	Calhoun = 26025,
	Cass = 26027,
	DeKalb = 18033,
	Elkhart = 18039,
	Hillsdale = 26059,
	Kalamazoo = 26077,
	Kosciusko = 18085,
	LaGrange = 18087,
	Noble = 18113,
	StJosephIN = 18141,
	StJosephMI = 26149,
	Steuben = 18151,
	VanBuren = 26159,
	UnknownCounty = 99999
};

export type State = {
	id: StateFips;
	name: string;
	abbr: string;
};

export type County = {
	id: CountyFips;
	state: State;
	name: string;
	lat: number;
	lon: number;
	areaLand: number;
	areaWater: number;
};
