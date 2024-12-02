
const mmddyyyyRe = /^\d\d?\/\d\d?\/\d{4}.*$/;
const yyyymmddRe = /^\d{4}-\d\d?-\d\d?.*$/;

// matches either 'MM/DD/YYYY' or 'YYYY-MM-DD'
// anything after the match is ignored
// failed matches is replaced with '2020-01-01'
// returns 17:00 in UTC which is noon in EST, or 13:00 in EDT
export function parseUTCMinus5Date(str: string): Date {
	let year = 2020;
	let month = 1;
	let day = 1;
	if(str.match(mmddyyyyRe)) {
		const parts = str.split('/');
		month = parseInt(parts[0]);
		day = parseInt(parts[1]);
		year = parseInt(parts[2]);
	} else if (str.match(yyyymmddRe)) {
		const parts = str.split('-');
		year = parseInt(parts[0]);
		month = parseInt(parts[1]);
		day = parseInt(parts[2]);
	}

	return new Date(Date.UTC(year, month - 1, day, 17));
}


// always returns YYYY-MM-DDT12:00:00 (US/Eastern - UST or EDT)
// export function UTCMinus5NoonDate(date?: Date | string | number | undefined): Date {
// 	if (typeof date === 'string') {
// 		date = parseUTCMinus5Date(date);
// 	};
// 	if (typeof date === 'number') date = new Date(date);
// 	if (!date || isNaN(date.valueOf())) date = new Date();
// 	// return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
// 	return parseUTCMinus5Date(date.toISOString());
// }

const w = window as any;
w['parseTzDate'] = parseUTCMinus5Date;

const shortMon = (date: Date): string => date.toLocaleString('default', { month: 'short' });
export function fmtMonDY(date: Date | undefined): string {
	if (!date) return 'N/A';
	return `${shortMon(date)} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
	// return `${date.getUTCFullYear()}-${shortMon(date)}-${date.getUTCDate()}`;
}

export function fmtDateDMonY(date: Date | undefined): string {
	if (!date) return 'N/A';
	return `${date.getUTCDate()} ${shortMon(date)} ${date.getUTCFullYear()}`;
}
// YYYY-MM-DD

export function fmtDateValue(date: Date) {
	if (!date || isNaN(date.valueOf())) return '';

	const offset = date.getTimezoneOffset();
	date = new Date(date.getTime() - (offset * 60 * 1000));
	return date.toISOString().split('T')[0];
}
;


export function fmtDateISO(date: Date) {
	return date.toISOString();
}

// month is 0-indexed
// days are 1-indexed, but day=0 means last day of previous month

export function daysInMonth(year: number, month: number) {
	return new Date(year, month + 1, 0).getDate();
}


export function oneMonthAgo() {
	const oneDay = 1000 * 60 * 60 * 24;
	const oneMonth = oneDay * 30;
	return (Date.now() - oneMonth);
}


export function dateEqualYMD(date1: Date, date2: Date): boolean {
	if (!date1 || !date2) return false;
	if (!date1.getUTCFullYear || !date2.getUTCFullYear) {
		console.warn('messed up dates', date1, date2);
		return false;
	}
	return date1.getUTCFullYear() === date2.getUTCFullYear() &&
		date1.getUTCMonth() === date2.getUTCMonth() &&
		date1.getUTCDate() === date2.getUTCDate();
}
