import { minDate, defaultDate, todayDate } from '$src/lib/utils/date';
import { describe, it, expect } from 'vitest';

describe('UTC 17:00 dates', () => {
	it('date constants at UTC 17:00', () => {
		// const d1 = defaultDate
		expect(minDate.getUTCHours()).toBe(17);
		expect(defaultDate.getUTCHours()).toBe(17);
		expect(todayDate.getUTCHours()).toBe(17);
	});
});
