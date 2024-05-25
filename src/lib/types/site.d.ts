import { StateFips } from "./fips";

export type Site = {
	id: string; // 'elkhart-23'
	dateset: string; // 'elkhart'
	name: string; // 'New Miller Stutsman - CR 28'
	lat: number;
	lon: number;

	state: StateFips; // 18 (statefp=18 is indiana)
	county: CountyFips; // 39 (countyfp=39 is elkhart co)
	huc10: string; // 'indiana'
	huc12: string; // 'indiana'
};
