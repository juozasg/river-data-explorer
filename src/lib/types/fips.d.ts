export enum StateFips {
	Indiana = 18,
	Michigan = 26
}

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
	VanBuren = 26159
}

export type State = {
	id: StateFips;
	name: string;
	abbr: string;
};

export type County = {
	id: CountyFips;
	state: StateFips;
	name: string;
	lat: number;
	lon: number;
	areaLand: number;
	areaWater: number;
	population: number;
};



// 21,26,1622953,Berrien,Berrien County,41.7913818,-86.7425435,1470.543783,2625.44973
// 23,26,1622954,Branch,Branch County,41.9184551,-85.0668852,1311.605515,34.420092
// 25,26,1622955,Calhoun,Calhoun County,42.2429896,-85.0123853,1829.206358,31.260656
// 27,26,1622956,Cass,Cass County,41.9172431,-86.000142,1269.366892,47.148115
// 33,18,450346,DeKalb,DeKalb County,41.4011894,-85.0001854,939.731962,2.657419
// 39,18,450348,Elkhart,Elkhart County,41.6006928,-85.8639864,1199.603973,12.434083
// 59,26,1622972,Hillsdale,Hillsdale County,41.9274606,-84.6374794,1549.207129,22.939158
// 77,26,1622981,Kalamazoo,Kalamazoo County,42.2462657,-85.5328544,1455.523647,47.441742
// 85,18,450367,Kosciusko,Kosciusko County,41.2442928,-85.8615754,1376.41211,59.459183
// 87,18,450368,LaGrange,LaGrange County,41.6424623,-85.4278448,983.236292,18.318591
// 113,18,450377,Noble,Noble County,41.4046794,-85.4172708,1064.081178,17.064798
// 141,18,452855,St. Joseph,St. Joseph County,41.6177233,-86.2880476,1185.940302,9.04285
// 149,26,1625034,St. Joseph,St. Joseph County,41.9114878,-85.5228703,1296.53637,52.915575
// 151,18,450390,Steuben,Steuben County,41.643467,-85.0024051,799.729298,35.454787
// 159,26,1623020,Van Buren,Van Buren County,42.2821497,-86.3060762,1574.265761,1248.571787