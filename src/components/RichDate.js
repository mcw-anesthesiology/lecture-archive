/** @format */

import React from 'react';
import { DateTime } from 'luxon';
import { parseDate } from '../utils.js';

export default function RichDate({ date }) {
	const dt = parseDate(date);
	return <time dateTime={dt.toISO()}>{dt.toLocaleString()}</time>;
}

export function RichTime({ time }) {
	const dt = parseDate(time);
	return (
		<time dateTime={dt.toISO()}>
			{dt.toLocaleString(DateTime.TIME_SIMPLE)}
		</time>
	);
}
