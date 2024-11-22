import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjsarr from "dayjs/plugin/arraySupport";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(dayjsarr);

export const tz = 'US/Eastern';

// either 'MM/DD/YYYY' or 'YYYY-MM-DD'
// or 'YYYY-MM-DDTHH:MM:SS' (THH:MM:SS is discarded)
// 'Z.*' is discarded t
// returns noon in EST
export function parseEasternTzDate(str: string): Date {
	const d = new Date(str.split('T')[0].split('Z')[0]);
	// don't ask why the hour must be parsed and set to 12
	const djs = dayjs.tz([d.getFullYear(), d.getMonth(), d.getDate(), 12], tz).hour(12);
	return djs.toDate();
}


// always returns YYYY-MM-DDT12:00:00 (US/Eastern - UST or EDT)
export function USEasternNoonDate(date?: Date | string | number | undefined): Date {
	if (typeof date === 'string') {
		date = parseEasternTzDate(date);
	};
	if (typeof date === 'number') date = new Date(date);
	if (!date || isNaN(date.valueOf())) date = new Date();
	// return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
	return parseEasternTzDate(date.toISOString());
}

const w = window as any;
w['dayjs'] = dayjs;
w['tz'] = tz;
w['parseTzDate'] = parseEasternTzDate;

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
