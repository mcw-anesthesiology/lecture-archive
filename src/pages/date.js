/** @format */

import React, { useState, useEffect, useCallback } from 'react';
import { Router } from '@reach/router';

import gql from 'graphql-tag';

import Layout from '../components/Layout.js';
import SEO from '../components/Seo.js';
import {
	useBeforeAfterDateQueryParams,
	DateRangeSelector
} from '../components/SearchForm.js';
import LectureList, { LECTURE_LIST_FIELDS } from '../components/LectureList.js';

const DATE_LECTURES_QUERY = gql`
	query DateLecturesQuery($after: Date, $before: Date) {
		lectures(after: $after, $before: $before) {

		}
	}
`;

export default function DatePage({ location, navigate }) {
	const { after, before } = useBeforeAfterDateQueryParams(location);
	const [selectedAfter, setSelectedAfter] = useState(after);
	const [selectedBefore, setSelectedBefore] = useState(before);
	useEffect(() => {
		setSelectedAfter(after);
	}, [after]);
	useEffect(() => {
		setSelectedBefore(before);
	}, [before]);

	const handleSubmit = useCallback(event => {
		event.preventDefault();

		const params = new URLSearchParams();
		if (selectedAfter) {
			params.set('after', selectedAfter.valueOf());
		}
		if (selectedBefore) {
			params.set('before', selectedBefore.valueOf());
		}
		navigate(`/date?${params.toString()}`);
	}, []);

	return (
		<Layout className="date">
			<SEO title="Lectures by date" />

			<form onSubmit={handleSubmit}>
				<DateRangeSelector
					after={selectedAfter}
					before={selectedBefore}
					setAfter={setSelectedAfter}
					setBefore={setSelectedBefore}
				/>
			</form>
		</Layout>
	);
}
