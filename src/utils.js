import { DateTime } from 'luxon';

export function parseDate(s) {
	return DateTime.fromSQL(s, { zone: 'UTC' }).setZone();
}
