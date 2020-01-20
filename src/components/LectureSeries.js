/** @format */

import React, { useState } from 'react';
import { Link } from 'gatsby';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import Loading from './Loading.js';
import { LectureGrid, LECTURE_LIST_FIELDS } from './LectureList.js';
import SEO from './Seo.js';

const LECTURE_SERIES_QUERY = gql`
	query LectureSeriesQuery($id: ID, $hasRecording: Boolean) {
		lecture_series(id: $id) {
			id
			name
			description
			lectures(
				has_recording: $hasRecording
				orderBy: [{ field: "lecture_date_start", order: DESC }]
			) {
				...LectureListFields
				lecture_date_start
			}
		}
	}
	${LECTURE_LIST_FIELDS}
`;

export function LectureSeriesContainer({ id }) {
	const [recordingsOnly, setRecordingsOnly] = useState(true);
	const { data, loading } = useQuery(LECTURE_SERIES_QUERY, {
		variables: {
			id,
			hasRecording: recordingsOnly || undefined
		},
		fetchPolicy: 'cache-and-network'
	});

	let lectureSeries;

	if (data && data.lecture_series && data.lecture_series.length > 0) {
		lectureSeries = data.lecture_series[0];
	}

	return (
		<div>
			<form className="lecture-series-filter">
				<label>
					<input
						type="checkbox"
						checked={recordingsOnly}
						onChange={event => {
							setRecordingsOnly(event.target.checked);
						}}
					/>
					Only show lectures with recordings
				</label>
			</form>

			{loading ? (
				<Loading />
			) : lectureSeries ? (
				<LectureSeries lectureSeries={lectureSeries} />
			) : (
				<p>Sorry, we couldn't find that lecture series</p>
			)}
		</div>
	);
}

export default function LectureSeries({ lectureSeries }) {
	return (
		<section>
			<h1>{lectureSeries.name}</h1>

			<LectureGrid lectures={lectureSeries.lectures} />
		</section>
	);
}
