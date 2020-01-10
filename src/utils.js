import { DateTime } from 'luxon';

export function parseDate(s) {
	return DateTime.fromISO(s.replace(' ', 'T'));
}
