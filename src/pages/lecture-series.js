/** @format */

import React, { useState } from 'react';
import { Link } from 'gatsby';
import { useQuery, gql } from '@apollo/client';

import Layout from '../components/Layout.js';
import SEO from '../components/Seo.js';
import LectureList, { LECTURE_LIST_FIELDS } from '../components/LectureList.js';
import Loading from '../components/Loading.js';

import '../styles/lecture-series.css';

const LECTURE_SERIES_QUERY = gql`
	query LectureSeriesQuery($limit: Int, $hasRecording: Boolean) {
		lecture_series(orderBy: [{ field: "name", order: ASC }]) {
			id
			name
			description
			lectures(
				has_recording: $hasRecording
				limit: $limit
				orderBy: [{ field: "lecture_date_start", order: DESC }]
			) {
				...LectureListFields
				lecture_date_start
			}
		}
	}
	${LECTURE_LIST_FIELDS}
`;

export default function LectureSeriesPage() {
	const [recordingsOnly, setRecordingsOnly] = useState(true);
	const [limit, setLimit] = useState(5);

	const { data, loading } = useQuery(LECTURE_SERIES_QUERY, {
		variables: {
			limit,
			hasRecording: recordingsOnly || undefined
		},
		fetchPolicy: 'cache-and-network'
	});

	return (
		<Layout className="lecture-series">
			<SEO title="Lecture series" />

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

				<label className="limit-control">
					Lectures per series
					<input type="number" value={limit} onChange={event => {
						setLimit(event.target.value);
					}} />
				</label>
			</form>

			{loading ? (
				<Loading />
			) : (
				<div>
					{data.lecture_series
						.filter(ls => ls.lectures.length)
						.map(ls => (
							<div key={ls.id}>
								<h2>{ls.name}</h2>
								<p>{ls.description}</p>

								<LectureList lectures={ls.lectures} />
							</div>
						))}
				</div>
			)}
		</Layout>
	);
}
