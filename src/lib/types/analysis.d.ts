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
