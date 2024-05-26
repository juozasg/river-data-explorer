import { StateFips } from "./fips";

export type Site = {
	id: string; // 'elkhart-123'
	dataset: string; // 'elkhart'
	name: string; // 'New Miller Stutsman - CR 28'
	lat: number;
	lon: number;

	state: StateFips; // 18 (statefp=18 is indiana)
	county: CountyFips; // 18039 (countyfp=18039 is elkhart co)
	huc10: string; // '0405000119'
	huc12: string; // '40500011902'
};
