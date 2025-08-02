import { defineGlobal } from ".";

// each day is 17:00 UTC
export const defaultDate = new Date(Date.UTC(2020, 0, 1, 17));
export const minDate = new Date(Date.UTC(1970, 0, 1, 17));
const localNow = new Date();
export const todayDate = new Date(Date.UTC(localNow.getUTCFullYear(), localNow.getUTCMonth(), localNow.getUTCDate(), 17));


// matches either 'MM/DD/YYYY' or 'YYYY-MM-DD'
const mmddyyyyRe = /^\d\d?\/\d\d?\/\d{4}.*$/;
const yyyymmddRe = /^\d{4}-\d\d?-\d\d?.*$/;

// anything after the match is ignored
// failed matches is replaced with '2000-01-01'
// returns 17:00 in UTC which is noon in EST, or 13:00 in EDT
export function parseUTC1700Date(str: string): Date {
	let year = 2000;
	let month = 1;
	let day = 1;
	if (str.match(mmddyyyyRe)) {
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

// defineGlobal('parseUTC1700Date', parseUTC1700Date);

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

export const second = 1000;
export const minute = second * 60;
export const hour = minute * 60;
export const day = hour * 24;

export const dateSteps = {
	'15m': 15 * minute,
	'1h': hour,
	'3h': 3 * hour,
	'6h': 6 * hour,
	'12h': 12 * hour,
	'1d': day,
	'7d': 7 * day,
	'14d': 14 * day,
	'30d': 30 * day,
	'90d': 90 * day,
	'180d': 180 * day,
	'1y': 365 * day,
	'5y': 365 * day * 5,
}

export type DateStep = keyof typeof dateSteps;

export const roundToNearest15Minutes = (date: Date) => {
	const minutes = date.getMinutes();
	const roundedMinutes = Math.floor(minutes / 15) * 15;
	date.setMinutes(roundedMinutes);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date;
};

export const nowRoundedToNearest15Minutes = () => {
	const now = new Date();
	return roundToNearest15Minutes(now);
}

export const oldestDate = new Date(Date.UTC(1989, 3, 1, 0, 0, 0)); // 1989-04-01T00:00:00Z
export const oldestYear = oldestDate.getUTCFullYear();

// from 1989 to this year
export const availableYears = Array.from({ length: todayDate.getUTCFullYear() - oldestYear + 1 }, (_, i) => oldestYear + i);
