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
