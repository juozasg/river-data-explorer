export type VariableStats = {
	label: string;
	lastObservation?: number;
	numObservations: number;
	min: number;
	max: number;
	mean: number;
	median: number;
	stdDev: number;
	dateFromLabel: string;
	dateToLabel: string;
};


export type SitesDataStats = {
	numSites: number;
	numVariables: number;
	numRecords: number;
	dateFromLabel?: string;
	dateToLabel?: string;
};
